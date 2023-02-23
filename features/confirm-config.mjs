import readline from 'readline-sync';
import { PAGE_MAX, FILE_PATH} from '../config.mjs';

export const confirmConfig = (tag) => {
  console.log('\n================================================================================\n');
  console.log("스크래핑 시작\n");
  console.log(`PAGE_MAX: ${PAGE_MAX} (${PAGE_MAX * 40}개 / 맥스 도달전에도 해당 페이지의 첫번째 아이템이 같으면 종료)`);
  console.log(`tag: ${tag}`);
  console.log(`filePath: ${FILE_PATH}`);
  console.log('\n================================================================================\n');
  const prompt = readline.question("진행 하시려면 'y|Y'를 입력해주세요");
  if (prompt === 'y' || prompt === 'Y') {
    return true;
  } else {
    return false;
  }
}
