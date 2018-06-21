'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var ts = require('typescript');
var logger_1 = require('./logger');
function transpileTypescript(filePath, fileSrc, compilerOptions) {
  logger_1.logOnce('Compiling via normal transpileModule call');
  var transpileOutput = transpileViaTranspileModule(
    filePath,
    fileSrc,
    compilerOptions
  );
  return {
    code: transpileOutput.outputText,
    map: transpileOutput.sourceMapText,
  };
}
exports.transpileTypescript = transpileTypescript;
function transpileViaTranspileModule(filePath, fileSource, compilerOptions) {
  return ts.transpileModule(fileSource, {
    compilerOptions: compilerOptions,
    fileName: filePath,
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNwaWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90cmFuc3BpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsK0JBQWlDO0FBQ2pDLG1DQUFtQztBQUluQyw2QkFDRSxRQUFnQixFQUNoQixPQUFlLEVBQ2YsZUFBbUM7SUFFbkMsZ0JBQU8sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0lBQ3JELElBQU0sZUFBZSxHQUFHLDJCQUEyQixDQUNqRCxRQUFRLEVBQ1IsT0FBTyxFQUNQLGVBQWUsQ0FDaEIsQ0FBQztJQUNGLE9BQU87UUFDTCxJQUFJLEVBQUUsZUFBZSxDQUFDLFVBQVU7UUFDaEMsR0FBRyxFQUFFLGVBQWUsQ0FBQyxhQUFhO0tBQ25DLENBQUM7QUFDSixDQUFDO0FBZkQsa0RBZUM7QUFLRCxxQ0FDRSxRQUFnQixFQUNoQixVQUFrQixFQUNsQixlQUFtQztJQUVuQyxPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFO1FBQ3BDLGVBQWUsaUJBQUE7UUFDZixRQUFRLEVBQUUsUUFBUTtLQUNuQixDQUFDLENBQUM7QUFDTCxDQUFDIn0=
