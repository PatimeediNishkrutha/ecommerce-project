const { Builder, By, until } = require("selenium-webdriver");

async function testCart() {
  let driver = await new Builder()
    .forBrowser("chrome")
    .build();

  try {
    // Open home page
    await driver.get("http://localhost:3000/");

    // Wait for the first Add to Cart button
    let addToCartButton = await driver.wait(
      until.elementLocated(
        By.css(".add-cart-button")
      ),
      10000
    );

    // Click Add to Cart
    await addToCartButton.click();

    // Wait for Cart link in the navbar
    let cartLink = await driver.wait(
      until.elementLocated(
        By.css('a[href="/cart"]')
      ),
      10000
    );

    // Click Cart from the navbar
    await cartLink.click();

    // Wait for Cart heading
    let heading = await driver.wait(
      until.elementLocated(
        By.css("h1")
      ),
      10000
    );

    let headingText = await heading.getText();

    console.log("Cart heading:", headingText);

    // Wait for cart item
    let cartItem = await driver.wait(
      until.elementLocated(
        By.css(".cart-item")
      ),
      10000
    );

    // Verify cart
    if (
      headingText === "My Cart" &&
      await cartItem.isDisplayed()
    ) {
      console.log("CART TEST PASSED!");
    } else {
      console.log("CART TEST FAILED!");
    }

  } finally {
    await driver.quit();
  }
}

testCart();