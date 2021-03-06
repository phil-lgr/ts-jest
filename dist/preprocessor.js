'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var crypto = require('crypto');
var logger_1 = require('./logger');
var postprocess_1 = require('./postprocess');
var utils_1 = require('./utils');
var transpiler_1 = require('./transpiler');
function process(src, filePath, jestConfig, transformOptions) {
  if (transformOptions === void 0) {
    transformOptions = { instrument: false };
  }
  var compilerOptions = utils_1.getTSConfig(
    jestConfig.globals,
    jestConfig.rootDir
  );
  logger_1.logOnce('final compilerOptions:', compilerOptions);
  var isTsFile = /\.tsx?$/.test(filePath);
  var isJsFile = /\.jsx?$/.test(filePath);
  var isHtmlFile = /\.html$/.test(filePath);
  if (isHtmlFile && jestConfig.globals.__TRANSFORM_HTML__) {
    src = 'module.exports=`' + src + '`;';
  }
  var processFile =
    compilerOptions.allowJs === true ? isTsFile || isJsFile : isTsFile;
  if (!processFile) {
    return src;
  }
  var tsJestConfig = utils_1.getTSJestConfig(jestConfig.globals);
  logger_1.logOnce('tsJestConfig: ', tsJestConfig);
  if (tsJestConfig.enableTsDiagnostics) {
    utils_1.runTsDiagnostics(filePath, compilerOptions);
  }
  var transpileOutput = transpiler_1.transpileTypescript(
    filePath,
    src,
    compilerOptions
  );
  if (tsJestConfig.ignoreCoverageForAllDecorators === true) {
    transpileOutput.code = transpileOutput.code.replace(
      /__decorate/g,
      '/* istanbul ignore next */__decorate'
    );
  }
  if (tsJestConfig.ignoreCoverageForDecorators === true) {
    transpileOutput.code = transpileOutput.code.replace(
      /(__decorate\(\[\r?\n[^\n\r]*)\/\*\s*istanbul\s*ignore\s*decorator(.*)\*\//g,
      '/* istanbul ignore next$2*/$1'
    );
  }
  var outputText = postprocess_1.postProcessCode(
    compilerOptions,
    jestConfig,
    tsJestConfig,
    transformOptions,
    transpileOutput,
    filePath
  );
  logger_1.flushLogs();
  return { code: outputText.code, map: outputText.map };
}
exports.process = process;
function getCacheKey(fileData, filePath, jestConfigStr, transformOptions) {
  if (transformOptions === void 0) {
    transformOptions = { instrument: false };
  }
  var jestConfig = JSON.parse(jestConfigStr);
  var tsConfig = utils_1.getTSConfig(jestConfig.globals, jestConfig.rootDir);
  return crypto
    .createHash('md5')
    .update(JSON.stringify(tsConfig), 'utf8')
    .update(JSON.stringify(transformOptions), 'utf8')
    .update(fileData + filePath + jestConfigStr, 'utf8')
    .digest('hex');
}
exports.getCacheKey = getCacheKey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlcHJvY2Vzc29yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3ByZXByb2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUFpQztBQVFqQyxtQ0FBOEM7QUFDOUMsNkNBQWdEO0FBQ2hELGlDQUF5RTtBQUN6RSwyQ0FBbUQ7QUFFbkQsaUJBQ0UsR0FBVyxFQUNYLFFBQWMsRUFDZCxVQUFzQixFQUN0QixnQkFBMEQ7SUFBMUQsaUNBQUEsRUFBQSxxQkFBdUMsVUFBVSxFQUFFLEtBQUssRUFBRTtJQUkxRCxJQUFNLGVBQWUsR0FBRyxtQkFBVyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRTVFLGdCQUFPLENBQUMsd0JBQXdCLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFFbkQsSUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMxQyxJQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzFDLElBQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFHNUMsSUFBSSxVQUFVLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRTtRQUN2RCxHQUFHLEdBQUcsa0JBQWtCLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQztLQUN2QztJQUVELElBQU0sV0FBVyxHQUNmLGVBQWUsQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7SUFFckUsSUFBSSxDQUFDLFdBQVcsRUFBRTtRQUNoQixPQUFPLEdBQUcsQ0FBQztLQUNaO0lBRUQsSUFBTSxZQUFZLEdBQUcsdUJBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDekQsZ0JBQU8sQ0FBQyxnQkFBZ0IsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUl4QyxJQUFJLFlBQVksQ0FBQyxtQkFBbUIsRUFBRTtRQUNwQyx3QkFBZ0IsQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLENBQUM7S0FDN0M7SUFFRCxJQUFNLGVBQWUsR0FBRyxnQ0FBbUIsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBRTVFLElBQUksWUFBWSxDQUFDLDhCQUE4QixLQUFLLElBQUksRUFBRTtRQUN4RCxlQUFlLENBQUMsSUFBSSxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUNqRCxhQUFhLEVBQ2Isc0NBQXNDLENBQ3ZDLENBQUM7S0FDSDtJQUNELElBQUksWUFBWSxDQUFDLDJCQUEyQixLQUFLLElBQUksRUFBRTtRQUNyRCxlQUFlLENBQUMsSUFBSSxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUNqRCw0RUFBNEUsRUFDNUUsK0JBQStCLENBQ2hDLENBQUM7S0FDSDtJQUVELElBQU0sVUFBVSxHQUFHLDZCQUFlLENBQ2hDLGVBQWUsRUFDZixVQUFVLEVBQ1YsWUFBWSxFQUNaLGdCQUFnQixFQUNoQixlQUFlLEVBQ2YsUUFBUSxDQUNULENBQUM7SUFFRixrQkFBUyxFQUFFLENBQUM7SUFFWixPQUFPLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUN4RCxDQUFDO0FBaEVELDBCQWdFQztBQUtELHFCQUNFLFFBQWdCLEVBQ2hCLFFBQWMsRUFDZCxhQUFxQixFQUNyQixnQkFBMEQ7SUFBMUQsaUNBQUEsRUFBQSxxQkFBdUMsVUFBVSxFQUFFLEtBQUssRUFBRTtJQUUxRCxJQUFNLFVBQVUsR0FBZSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBRXpELElBQU0sUUFBUSxHQUFHLG1CQUFXLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFckUsT0FBTyxNQUFNO1NBQ1YsVUFBVSxDQUFDLEtBQUssQ0FBQztTQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLENBQUM7U0FDeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxNQUFNLENBQUM7U0FDaEQsTUFBTSxDQUFDLFFBQVEsR0FBRyxRQUFRLEdBQUcsYUFBYSxFQUFFLE1BQU0sQ0FBQztTQUNuRCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkIsQ0FBQztBQWhCRCxrQ0FnQkMifQ==
