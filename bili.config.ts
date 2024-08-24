import { Config } from 'bili'

const config: Config = {
  plugins: {
    typescript2: {
      tsconfigOverride: {
        include: ['src']
      }
    }
  },

  input: 'src/index.ts',
  output: {
    format: ['cjs', 'esm', 'umd', 'umd-min'],
    moduleName: "lootalot",
    fileName: (context, defaultFileName) => {
      switch (context.format) {
        case "umd":
          return context.minify ? "lootalot.min.js" : "lootalot.js";
        case "esm":
          return "lootalot.esm.js";
        case "cjs":
          return "lootalot.cjs.js";
        default:
          return defaultFileName;
      }
    },
  }
}

export default config
