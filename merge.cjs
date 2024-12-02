// merge.cjs

const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');

// -------------------------------------------------------------------------------------------------
const mergeAndMinifyFiles = async (title) => {

  // Reset.css
  const toReset = () => {
    const filesToMinify = [
      './styles/Reset.css'
    ];
    const outputMinFile = './styles/Reset.min.css';

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

  // Init.css
  const toInit = () => {
    const filesToMinify = [
      './styles/Init.css'
    ];
    const outputMinFile = './styles/Init.min.css';

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
      './styles/jstyle/1_height.css',
      './styles/jstyle/1_width.css',
      './styles/jstyle/2_margin.css',
      './styles/jstyle/2_padding.css',
      './styles/jstyle/3_left_right.css',
      './styles/jstyle/3_top_bottom.css',
      './styles/jstyle/4_font.css',
      './styles/jstyle/4_color.css',
      './styles/jstyle/5_border_shadow_radius.css',
      './styles/jstyle/6_display_position_zindex.css',
      './styles/jstyle/7_keyframes_animation_etc.css'
    ];
    const outputFile = './styles/Jstyle.css';
    const outputMinFile = './styles/Jstyle.min.css';

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
  if (title === 'init') {
    toInit();
  }
  if (title === 'jstyle') {
    toJstyle();
  }
};

// -------------------------------------------------------------------------------------------------
mergeAndMinifyFiles('reset');
mergeAndMinifyFiles('init');
mergeAndMinifyFiles('jstyle');
