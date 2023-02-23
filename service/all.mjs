import puppeteer from 'puppeteer';
import writeXlsxFile from 'write-excel-file/node'
import { confirmConfig } from '../features/confirm-config.mjs';
import { TARGET_SITES, FILE_PATH, PAGE_MAX, HEADER_ROW } from '../config.mjs';

const PATH = "/category/ALL";

(async () => {
  const ok = confirmConfig("전체 상품 조회");
  if (!ok) return;

  const browser = await puppeteer.launch({ headless: false });
  const tab = await browser.newPage();
  const data = [
    HEADER_ROW,
  ];
  const siteLen = TARGET_SITES.length;
  for (let site = 0; site < siteLen; site++ ) {
    const targetSite = TARGET_SITES[site]
    console.log(`\n${targetSite}\n`);
    const endPoint = targetSite + PATH;
    let firstOfPage = null;

    outer: for (let page = 1; page <= PAGE_MAX; page++ ) {
      await tab.goto(endPoint + '?page=' + page);
      const els = await tab.$$("#CategoryProducts ul");
      
      const itemsUl = els[els.length - 1];
      const items = await itemsUl.$$('li');
      const len = items.length;
  
      for (let i = 0; i < len; i++) {
        const item = items[i];
        const [nameEl] = await item.$$('div>a>strong');
        const name = await (await nameEl.getProperty('textContent')).jsonValue();


        const [, ,priceEl] = await item.$$('div>a>div');
        const pieces = await priceEl.$$('strong');

        let price = '';
        if (pieces.length === 1) {
          const priceStr = await (await pieces[0].getProperty('textContent')).jsonValue();
          price = +priceStr.replace(/,/gi, "").replace("원", "");
        } else {
          const priceStr = await (await pieces[1].getProperty('textContent')).jsonValue();
          price = +priceStr.replace(/,/gi, "").replace("원", "");
        }

        if (i === 0) {
          if (firstOfPage === name) {
            break outer;
          }
          firstOfPage = name;
        }
        const row = [
          {
            type: String,
            value: name,
          },
          {
            type: Number,
            value: price,
          },
          {
            type: String,
            value: '',
          },
          {
            type: String,
            value: '',
          },
          {
            type: String,
            value: '',
          },
          {
            type: String,
            value: targetSite
          }
        ]
        data.push(row);
      }
    }
  }

  
  await writeXlsxFile(data, {
    filePath: FILE_PATH,
  });

  console.log('finished');
  await browser.close();
  return;
})();