// push.cjs

const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');

const winOrLinux = os.platform() === 'win32' ? "win" : "linux";
console.log(`Activated OS is : ${winOrLinux}`);

// git push (public) -------------------------------------------------------------------------------
const gitPushPublic = () => {
  try {
    const ignoreFile = ".gitignore";
    const ignorePublicFile = fs.readFileSync(".gitignore.public", "utf8");
    fs.writeFileSync(ignoreFile, ignorePublicFile, "utf8");

    const gitRmCached = (
      'git rm -r --cached .'
    );
    const gitAdd = (
      'git add .'
    );
    const gitCommit = (
      winOrLinux === "win"
      ? 'git commit -m \"%date% %time:~0,8%\"'
      : 'git commit -m \"$(date +%Y-%m-%d) $(date +%H:%M:%S)\"'
    );
    const gitPushPublic = (
      'git push origin master'
    );

    execSync(gitRmCached, { stdio: 'inherit' });
    execSync(gitAdd, { stdio: 'inherit' });
    execSync(gitCommit, { stdio: 'inherit' });
    execSync(gitPushPublic, { stdio: 'inherit' });

    fs.writeFileSync(ignoreFile, ignorePublicFile, "utf8");
  }
  catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// git push (private) ------------------------------------------------------------------------------
const gitPushPrivate = () => {
  try {
    const ignoreFile = ".gitignore";
    const ignorePublicFile = fs.readFileSync(".gitignore.public", "utf8");
    const ignorePrivateFile = fs.readFileSync(".gitignore.private", "utf8");
    fs.writeFileSync(ignoreFile, ignorePrivateFile, "utf8");

    const gitRmCached = (
      'git rm -r --cached .'
    );
    const gitAdd = (
      'git add .'
    );
    const gitCommit = (
      winOrLinux === "win"
      ? 'git commit -m \"%date% %time:~0,8%\"'
      : 'git commit -m \"$(date +%Y-%m-%d) $(date +%H:%M:%S)\"'
    );
    const gitPushPrivate = (
      'git push private master'
    );

    execSync(gitRmCached, { stdio: 'inherit' });
    execSync(gitAdd, { stdio: 'inherit' });
    execSync(gitCommit, { stdio: 'inherit' });
    execSync(gitPushPrivate, { stdio: 'inherit' });

    fs.writeFileSync(ignoreFile, ignorePublicFile, "utf8");
  }
  catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// -------------------------------------------------------------------------------------------------
gitPushPublic();
gitPushPrivate();
process.exit(0);