import { Builder, By, Key, until } from 'selenium-webdriver';
import * as dotenv from 'dotenv';
dotenv.config({path : 'config.env'});

let followAction = true;


function sleep(second) {
    return new Promise((resolve) => setTimeout(resolve, second * 1000));
} 

async function signin(driver){
    await sleep(7);
    let formElement = await driver.findElement(By.id('loginForm'));

    let usernameField = await formElement.findElement(By.name('username'));
    let passwordField = await formElement.findElement(By.name('password'));    
    let loginButton = await formElement.findElement(By.css('button[type="submit"]'));

    // // Enter the username and password
    await usernameField.sendKeys(process.env.USERID);
    await passwordField.sendKeys(process.env.PASSWORD);

    // // Locate and click the login button
    // let loginButton = await driver.findElement(By.id('login-button'));
    await loginButton.click();
}

async function accessPeople(driver){
    await driver.get(`${process.env.BASE_PATH}${process.env.PEOPLE_PATH}`);
    
}

async function follow(driver, times){
    if(times <= 0){
        return;
    }

    try {

        await sleep(7);
        await accessPeople(driver);
        await sleep(7);

        const followBtns = await driver.findElements(By.css('button[type="button"]'));
        
        for (const followBtn of followBtns) {
            await followBtn.click();
            await sleep(1);
        }
        
        await follow(driver, times-1);

    } catch (error) {
        return;
    }

}

async function unfollow(driver){

        await sleep(7);
        await driver.get(`${process.env.BASE_PATH}${process.env.MYUSERNAME}/following`);
        await sleep(7);

        let brk = false;
        while(true){
            const unfollowBtns = await driver.findElements(By.css('._acan._acap._acat._aj1-'));

            if (unfollowBtns.length === 0) {
                break;
            }

            for (const unfollowBtn of unfollowBtns) {
                try {
                    await unfollowBtn.click();
                    await sleep(1);
                    const unfollow = await driver.findElement(By.css('._a9--._a9-_'));
                    await unfollow.click();
                    await sleep(3);                
                } catch (error) {
                    brk = true;
                    break;
                }
            }
            if(brk){
                break;
            }
            await sleep(5);
        }    

    
}

async function main() {
  let driver = await new Builder().forBrowser('chrome').build();
  await driver.get(process.env.BASE_PATH);
  try {

    
    await signin(driver);

    if(followAction){
        await follow(driver, 10);
    }else{
        await unfollow(driver);
    }

  } finally {
    console.log('end');
  }
}

main();






