const { Builder, By } = require("selenium-webdriver");

async function testLogin() {
  let driver = await new Builder()
    .forBrowser("chrome")
    .build();

  try {
    // Open login page
    await driver.get("http://localhost:3000/login");

    // Find email field
    let email = await driver.findElement(
      By.css('input[type="email"]')
    );

    // Enter email
    await email.sendKeys("laddu65@gmail.com");

    // Find password field
    let password = await driver.findElement(
      By.css('input[type="password"]')
    );

    // Enter password
    await password.sendKeys("laddu@65");

    // Click Login button
    let loginButton = await driver.findElement(
      By.css('button[type="submit"]')
    );

    await loginButton.click();

    // Wait for login request/navigation
    await driver.sleep(3000);

    // Check current URL
    let currentUrl = await driver.getCurrentUrl();

    console.log("Current URL:", currentUrl);

    if (currentUrl === "http://localhost:3000/") {
      console.log("LOGIN TEST PASSED!");
    } else {
      console.log("LOGIN TEST FAILED!");

      try {
        let errorMessage = await driver.findElement(
          By.css(".login-error")
        );

        console.log(
          "Login error:",
          await errorMessage.getText()
        );
      } catch {
        console.log("No login error message found.");
      }
    }
  } finally {
    await driver.quit();
  }
}

testLogin();