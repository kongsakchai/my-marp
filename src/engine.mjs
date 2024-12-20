import { alert } from '@mdit/plugin-alert';
import { attrs } from '@mdit/plugin-attrs';
import { tasklist } from '@mdit/plugin-tasklist';
import { customPlugin } from './plugin.mjs';

export default ({ marp }) => {
	marp.use(attrs);
	marp.use(tasklist, { disabled: false });
	marp.use(alert, { alertNames: ['tip', 'warning', 'caution', 'important', 'note', 'bug', 'example', 'info'] });
	marp.use(customPlugin);
	return marp;
};
