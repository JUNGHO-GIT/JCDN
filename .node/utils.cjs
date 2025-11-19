// utils.cjs

const { spawnSync } = require(`child_process`);
const path = require(`path`);

// 로깅 함수 -----------------------------------------------------------------------------------
const logger = (type=``, message=``) => {
	const format = (text=``) => text.trim().replace(/^\s+/gm, ``);
	const line = `----------------------------------------`;
	const colors = {
		line: `\x1b[38;5;214m`,
		info: `\x1b[36m`,
		success: `\x1b[32m`,
		warn: `\x1b[33m`,
		error: `\x1b[31m`,
		reset: `\x1b[0m`
	};
	const separator = `${colors.line}${line}${colors.reset}`;

	type === `info` && console.log(format(`
		${separator}
		${colors.info}[INFO]${colors.reset} - ${message}
	`));
	type === `success` && console.log(format(`
		${separator}
		${colors.success}[SUCCESS]${colors.reset} - ${message}
	`));
	type === `warn` && console.log(format(`
		${separator}
		${colors.warn}[WARN]${colors.reset} - ${message}
	`));
	type === `error` && console.log(format(`
		${separator}
		${colors.error}[ERROR]${colors.reset} - ${message}
	`));
};

// 명령 실행 함수 ------------------------------------------------------------------------------
// @ts-ignore
const runCommand = (cmd=``, args=[], ignoreError=false) => {
	logger(`info`, `실행: ${cmd} ${args.join(` `)}`);

	const result = spawnSync(cmd, args, {
		stdio: `inherit`,
		shell: true,
		env: process.env
	});

	result.error && (() => {
		logger(`error`, `${cmd} 실행 오류: ${result.error.message}`);
		!ignoreError && process.exit(1);
	})();

	result.status !== 0 && (() => {
		ignoreError ? (
			logger(`warn`, `${cmd} 경고 무시 (exit code: ${result.status})`)
		) : (
			logger(`error`, `${cmd} 실패 (exit code: ${result.status})`),
			process.exit(result.status || 1)
		);
	})();

	logger(`success`, `${cmd} 실행 완료`);
};

// PATH에 로컬 bin 추가 함수 -------------------------------------------------------------------
// @ts-ignore
const withLocalBinOnPath = (env) => {
	const binDir = path.join(process.cwd(), `node_modules`, `.bin`);
	const envPath = (env.PATH || env.Path || ``);
	const pathParts = envPath.split(path.delimiter).filter(Boolean);
	(!pathParts.includes(binDir)) ? pathParts.unshift(binDir) : void 0;

	const newEnv = ({ ...env });
	(process.platform === `win32`) ? (
		newEnv.Path = pathParts.join(path.delimiter)
	) : (
		newEnv.PATH = pathParts.join(path.delimiter)
	);
	return newEnv;
};

// spawn 래퍼 함수 -----------------------------------------------------------------------------
// @ts-ignore
const trySpawn = (cmd = ``, args = []) => {
	const options = { encoding: `utf8`, env: withLocalBinOnPath(process.env) };
	const result = spawnSync(cmd, args, options);
	return result;
};

// 모듈 내보내기 -------------------------------------------------------------------------------
module.exports = {
	logger,
	runCommand,
	withLocalBinOnPath,
	trySpawn
};