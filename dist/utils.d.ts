import * as tsc from 'typescript';
import { ConfigGlobals, JestConfig, TsJestConfig } from './jest-types';
import * as _ from 'lodash';
export declare function getTSJestConfig(globals: ConfigGlobals): TsJestConfig;
export declare function mockGlobalTSConfigSchema(
  globals: ConfigGlobals,
): ConfigGlobals;
export declare const getTSConfig: typeof getTSConfig_local & _.MemoizedFunction;
declare function getTSConfig_local(
  globals: any,
  rootDir?: string,
): tsc.CompilerOptions;
export declare function cacheFile(
  jestConfig: JestConfig,
  filePath: string,
  src: string,
): void;
export declare function runTsDiagnostics(
  filePath: string,
  compilerOptions: tsc.CompilerOptions,
): void;
export {};
