import terser from '@rollup/plugin-terser';
export default {
	input: 'src/Stats.js',
	output: [
		{
			format: 'umd',
			name: 'Stats',
			file: 'build/stats.js',
			indent: '\t'
		},
		{
			format: 'es',
			name: 'Stats',
			file: 'build/stats.module.js',
			indent: '\t'
		},
		{
			format: 'iife',
			name: 'Stats',
			file: 'build/stats.min.js',
      compact: true,
      plugins: [terser()],
			indent: '\t'
		}
	]
};
