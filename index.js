const pup = require("puppeteer");

const url = "https://www.mercadolivre.com.br/";
const serchFor = "macbook";
var count = 1;
const list = [];

(async () =>{
  const browser = await pup.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url);
  await page.waitForSelector("#cb1-edit");
  await page.type("#cb1-edit", serchFor);

  await page.keyboard.press('Enter');

  await page.waitForSelector(".ui-search-result__image");
  const links = await page.$$eval(".ui-search-result__image > a", el => el.map(link => link.href))

  for(const link of links){
    //sair do for para debug
    if(count == 10) continue;
    await page.goto(link);
    await page.waitForSelector('.ui-pdp-title');
    await page.waitForSelector('.andes-money-amount__fraction');

    const title = await page.$eval('.ui-pdp-title', element => element.innerText);
    const price = await page.$eval('.andes-money-amount__fraction', element => element.innerText);

    const seller = await page.evaluate(() => {
      const el = document.querySelector('.ui-pdp-seller__link-trigger');
      if(!el) return null;
      return el.innerText;
    })

    const obj = { }
    obj.title = title;
    obj.price = price;
    (seller ? obj.seller = seller : '');
    obj.link = link;
    list.push(obj);
    count++;
  }

  console.log(list);
  await page.waitForTimeout(3000)
  await browser.close();
})();