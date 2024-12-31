// push.cjs

const fs = require('fs');
const os = require('os');
const path = require('path');
const CleanCSS = require('clean-css');
const { execSync } = require('child_process');

const winOrLinux = os.platform() === 'win32' ? "win" : "linux";
console.log(`Activated OS is : ${winOrLinux}`);

// css 병합 및 압축 --------------------------------------------------------------------------------
const mergeAndMinifyFiles = async (title) => {

  // Reset.css
  const toReset = () => {
    const filesToMinify = [
      './style/Reset.css'
    ];
    const outputMinFile = './style/Reset.min.css';

    try {
      let mergedContent = '';
      for (const filePath of filesToMinify) {
        const absolutePath = path.resolve(filePath);
        if (fs.existsSync(absolutePath)) {
          const fileContent = fs.readFileSync(absolutePath, 'utf8');
          mergedContent += `\n/* ${path.basename(filePath)} */\n`;
          mergedContent += fileContent + '\n';
        }
        else {
          console.warn(`Warning: File not found - ${absolutePath}`);
        }
      }

      // Minify 처리
      const minified = new CleanCSS().minify(mergedContent).styles;

      // Minify된 CSS 저장
      fs.writeFileSync(outputMinFile, minified, 'utf8');
      console.log(`Minified CSS files into: ${outputMinFile}`);
    }
    catch (error) {
      console.error('Error merging and minifying files:', error);
    }
  };

  // Jstyle.css
  const toJstyle = () => {
    const filesToMerge = [
      './style/jstyle/1_height.css',
      './style/jstyle/1_width.css',
      './style/jstyle/2_margin.css',
      './style/jstyle/2_padding.css',
      './style/jstyle/3_left_right.css',
      './style/jstyle/3_top_bottom.css',
      './style/jstyle/4_font.css',
      './style/jstyle/4_color.css',
      './style/jstyle/5_border_shadow_radius.css',
      './style/jstyle/6_display_position_zindex.css',
      './style/jstyle/7_keyframes_animation_etc.css'
    ];
    const outputFile = './style/Jstyle.css';
    const outputMinFile = './style/Jstyle.min.css';

    try {
      let mergedContent = '';
      for (const filePath of filesToMerge) {
        const absolutePath = path.resolve(filePath);
        if (fs.existsSync(absolutePath)) {
          const fileContent = fs.readFileSync(absolutePath, 'utf8');
          mergedContent += `\n/* ${path.basename(filePath)} */\n`;
          mergedContent += fileContent + '\n';
        }
        else {
          console.warn(`Warning: File not found - ${absolutePath}`);
        }
      }

      // Minify 처리
      const minified = new CleanCSS().minify(mergedContent).styles;

      // 병합된 일반 내용을 출력 파일에 쓰기 (기존 내용 제거 후 작성)
      const outputDir = path.dirname(outputFile);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // 일반 CSS 저장
      fs.writeFileSync(outputFile, mergedContent, 'utf8');
      console.log(`Merged CSS files into: ${outputFile}`);

      // Minify된 CSS 저장
      fs.writeFileSync(outputMinFile, minified, 'utf8');
      console.log(`Minified CSS files into: ${outputMinFile}`);
    }
    catch (error) {
      console.error('Error merging and minifying files:', error);
    }
  };

  // Title에 따라 실행
  if (title === 'reset') {
    toReset();
  }
  if (title === 'jstyle') {
    toJstyle();
  }
};

// changelog 수정 ----------------------------------------------------------------------------------
const modifyChangelog = () => {
  try {
    // ex. 2024-11-03 (16:23:24)
    const currentDate = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    const currentTime = new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const changelog = fs.readFileSync('changelog.md', 'utf8');
    const versionPattern = /(\s*)(\d+[.]\d+[.]\d+)(\s*)/g;
    const matches = [...changelog.matchAll(versionPattern)];
    const lastMatch = matches[matches.length - 1];
    const lastVersion = lastMatch[2];
    const versionArray = lastVersion.split('.');
    versionArray[2] = (parseInt(versionArray[2]) + 1).toString();

    let newVersion = `\\[ ${versionArray.join('.')} \\]`;
    let newDateTime = `- ${currentDate} (${currentTime})`;
    newDateTime = newDateTime.replace(/([.]\s*[(])/g, ' (');
    newDateTime = newDateTime.replace(/([.]\s*)/g, '-');
    newDateTime = newDateTime.replace(/[(](\W*)(\s*)/g, '(');

    let newEntry = `\n## ${newVersion}\n\n${newDateTime}\n`;

    const updatedChangelog = changelog + newEntry;

    fs.writeFileSync('changelog.md', updatedChangelog, 'utf8');
  }
  catch (error) {
    console.error(error);
    process.exit(1);
  }
};

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
mergeAndMinifyFiles('reset');
mergeAndMinifyFiles('jstyle');
modifyChangelog();
gitPushPublic();
gitPushPrivate();
process.exit(0);