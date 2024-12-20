import { transformerNotationDiff, transformerNotationHighlight } from '@shikijs/transformers';
import { createHighlighter } from 'shiki';

const REX = /class:"([^"]*)"/;

const LANGS = ['javascript', 'typescript', 'js', 'ts', 'html', 'css', 'json', 'go', 'plaintext'];
const THEMES = {
	light: 'github-light',
	dark: 'github-dark',
};

const highlighter = await createHighlighter({
	themes: Object.values(THEMES),
	langs: LANGS,
});

const mermaid = (className, code) => {
	return `
  <div class="${className}">
    <div class="mermaid">${code}</div>
  </div>
  `;
};

const codeToHtml = (className, code, lang) => {
	return `
  <div class="${className}">
    <div class="language-${lang}">
        ${highlighter.codeToHtml(code, {
			themes: THEMES,
			lang,
			transformers: [transformerNotationDiff(), transformerNotationHighlight()],
		})}
    </div>
  </div>
  `;
};

const plaintext = (className, code) => {
	return codeToHtml(className, code, 'plaintext');
};

export const customPlugin = (md) => {
	md.core.ruler.push('scripts', (state) => {
		const { tokens } = state;
		tokens.push(
			{
				type: 'html_block',
				content: `<script src="/.marp/src/mermaid.mjs" type="module"></script>`,
			},
			{
				type: 'html_block',
				content: `<script src="/.marp/src/cnd.tailwind.mjs"></script>`,
			}
		);
	});

	md.renderer.rules.fence = (tokens, idx) => {
		const token = tokens[idx];
		const code = token.content.trim();
		const lang = token.info.split(' ').shift();
		const className = token.info.match(REX)?.[1] ?? '';

		if (lang === 'mermaid') {
			return mermaid(className, code);
		}
		if (LANGS.includes(lang) || lang === 'js') {
			return codeToHtml(className, code, lang);
		}

		return plaintext(className, code);
	};
};
