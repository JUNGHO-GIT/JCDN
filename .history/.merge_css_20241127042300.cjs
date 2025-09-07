const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');

// 병합할 파일들의 경로 목록
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

// 일반 파일 경로
const outputFile = './styles/Jstyle.css';

// Minify 파일 경로
const outputMinFile = './styles/Jstyle.min.css';

const mergeAndMinifyFiles = async () => {
  try {
    let mergedContent = '';

    for (const filePath of filesToMerge) {
      const absolutePath = path.resolve(filePath);

      // 파일이 존재하는지 확인
      if (fs.existsSync(absolutePath)) {
        const fileContent = fs.readFileSync(absolutePath, 'utf8');
        mergedContent += `\n/* ${path.basename(filePath)} */\n`;
        mergedContent += fileContent + '\n';
      } else {
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
  } catch (error) {
    console.error('Error merging and minifying files:', error);
  }
};

// 병합 및 Minify 실행
mergeAndMinifyFiles();
