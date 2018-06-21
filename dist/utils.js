'use strict';
var __assign =
  (this && this.__assign) ||
  Object.assign ||
  function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
Object.defineProperty(exports, '__esModule', { value: true });
var crypto = require('crypto');
var fs = require('fs');
var fsExtra = require('fs-extra');
var path = require('path');
var tsc = require('typescript');
var logger_1 = require('./logger');
var _ = require('lodash');
function getTSJestConfig(globals) {
  return globals && globals['ts-jest'] ? globals['ts-jest'] : {};
}
exports.getTSJestConfig = getTSJestConfig;
function formatTsDiagnostics(errors) {
  var defaultFormatHost = {
    getCurrentDirectory: function() {
      return tsc.sys.getCurrentDirectory();
    },
    getCanonicalFileName: function(fileName) {
      return fileName;
    },
    getNewLine: function() {
      return tsc.sys.newLine;
    },
  };
  return tsc.formatDiagnostics(errors, defaultFormatHost);
}
function readCompilerOptions(configPath, rootDir) {
  configPath = path.resolve(rootDir, configPath);
  var _a = tsc.readConfigFile(configPath, tsc.sys.readFile),
    config = _a.config,
    error = _a.error;
  if (error) {
    throw error;
  }
  var _b = tsc.parseJsonConfigFileContent(
      config,
      tsc.sys,
      path.resolve(rootDir)
    ),
    errors = _b.errors,
    options = _b.options;
  if (errors.length > 0) {
    var formattedErrors = formatTsDiagnostics(errors);
    throw new Error(
      'Some errors occurred while attempting to read from ' +
        configPath +
        ': ' +
        formattedErrors
    );
  }
  return options;
}
function getStartDir() {
  var grandparent = path.resolve(__dirname, '..', '..');
  if (grandparent.endsWith(path.sep + 'node_modules')) {
    return process.cwd();
  }
  return '.';
}
function getPathToClosestTSConfig(startDir, previousDir) {
  if (!startDir) {
    return getPathToClosestTSConfig(getStartDir());
  }
  var tsConfigPath = path.join(startDir, 'tsconfig.json');
  var startDirPath = path.resolve(startDir);
  var previousDirPath = path.resolve(previousDir || '/');
  if (startDirPath === previousDirPath || fs.existsSync(tsConfigPath)) {
    return tsConfigPath;
  }
  return getPathToClosestTSConfig(path.join(startDir, '..'), startDir);
}
function getTSConfigPathFromConfig(globals) {
  var defaultTSConfigFile = getPathToClosestTSConfig();
  if (!globals) {
    return defaultTSConfigFile;
  }
  var tsJestConfig = getTSJestConfig(globals);
  if (tsJestConfig.tsConfigFile) {
    return tsJestConfig.tsConfigFile;
  }
  return defaultTSConfigFile;
}
function mockGlobalTSConfigSchema(globals) {
  var configPath = getTSConfigPathFromConfig(globals);
  return { 'ts-jest': { tsConfigFile: configPath } };
}
exports.mockGlobalTSConfigSchema = mockGlobalTSConfigSchema;
exports.getTSConfig = _.memoize(getTSConfig_local, function(globals, rootDir) {
  return JSON.stringify(globals, rootDir);
});
function getTSConfig_local(globals, rootDir) {
  if (rootDir === void 0) {
    rootDir = '';
  }
  var configPath = getTSConfigPathFromConfig(globals);
  logger_1.logOnce('Reading tsconfig file from path ' + configPath);
  var skipBabel = getTSJestConfig(globals).skipBabel;
  var config = readCompilerOptions(configPath, rootDir);
  logger_1.logOnce(
    'Original typescript config before modifications: ',
    __assign({}, config)
  );
  delete config.sourceMap;
  config.inlineSourceMap = true;
  config.inlineSources = true;
  delete config.outDir;
  if (configPath === path.join(getStartDir(), 'tsconfig.json')) {
    config.module = tsc.ModuleKind.CommonJS;
  }
  config.module = config.module || tsc.ModuleKind.CommonJS;
  config.jsx = config.jsx || tsc.JsxEmit.React;
  return config;
}
function cacheFile(jestConfig, filePath, src) {
  if (!jestConfig.testRegex || !filePath.match(jestConfig.testRegex)) {
    var outputFilePath = path.join(
      jestConfig.cacheDirectory,
      '/ts-jest/',
      crypto
        .createHash('md5')
        .update(filePath)
        .digest('hex')
    );
    fsExtra.outputFileSync(outputFilePath, src);
  }
}
exports.cacheFile = cacheFile;
function runTsDiagnostics(filePath, compilerOptions) {
  var program = tsc.createProgram([filePath], compilerOptions);
  var allDiagnostics = tsc.getPreEmitDiagnostics(program);
  if (allDiagnostics.length) {
    throw new Error(formatTsDiagnostics(allDiagnostics));
  }
}
exports.runTsDiagnostics = runTsDiagnostics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLCtCQUFpQztBQUNqQyx1QkFBeUI7QUFDekIsa0NBQW9DO0FBQ3BDLDJCQUE2QjtBQUM3QixnQ0FBa0M7QUFFbEMsbUNBQW1DO0FBQ25DLDBCQUE0QjtBQUU1Qix5QkFBZ0MsT0FBc0I7SUFDcEQsT0FBTyxPQUFPLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNqRSxDQUFDO0FBRkQsMENBRUM7QUFFRCw2QkFBNkIsTUFBd0I7SUFDbkQsSUFBTSxpQkFBaUIsR0FBOEI7UUFDbkQsbUJBQW1CLEVBQUUsY0FBTSxPQUFBLEdBQUcsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsRUFBN0IsQ0FBNkI7UUFDeEQsb0JBQW9CLEVBQUUsVUFBQSxRQUFRLElBQUksT0FBQSxRQUFRLEVBQVIsQ0FBUTtRQUMxQyxVQUFVLEVBQUUsY0FBTSxPQUFBLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFmLENBQWU7S0FDbEMsQ0FBQztJQUVGLE9BQU8sR0FBRyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFFRCw2QkFDRSxVQUFrQixFQUNsQixPQUFlO0lBRWYsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3pDLElBQUEscURBQW9FLEVBQWxFLGtCQUFNLEVBQUUsZ0JBQUssQ0FBc0Q7SUFDM0UsSUFBSSxLQUFLLEVBQUU7UUFDVCxNQUFNLEtBQUssQ0FBQztLQUNiO0lBRUssSUFBQSwyRUFJTCxFQUpPLGtCQUFNLEVBQUUsb0JBQU8sQ0FJckI7SUFFRixJQUFJLE1BQU0sQ0FBQyxNQUFN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
