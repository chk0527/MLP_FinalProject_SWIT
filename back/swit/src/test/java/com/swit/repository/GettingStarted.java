// package com.swit.repository;

// import java.time.Duration;

// import org.junit.jupiter.api.Test;
// import org.openqa.selenium.By;
// import org.openqa.selenium.WebDriver;
// import org.openqa.selenium.WebElement;
// import org.openqa.selenium.chrome.ChromeDriver;

// import lombok.extern.log4j.Log4j2;

// @Log4j2
// public class GettingStarted {   
// @Test   
// public void testGoogleSearch() throws InterruptedException {
//         // Optional. If not specified, WebDriver searches the PATH for chromedriver.
//         // System.setProperty("webdriver.chrome.driver", "/path/to/chromedriver");
//         WebDriver driver = new ChromeDriver();
//         driver.get("https://map.naver.com/p/search/%EC%8A%A4%ED%84%B0%EB%94%94/");
//         // Thread.sleep(5000);
//          // Let the user actually see something!
//         driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(3));

//         driver.switchTo().frame("searchIframe");
//         driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(3));
        
//         WebElement searchBox = driver.findElement(By.className("YwYLL"));
//         searchBox.click();

//         driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
//         driver.switchTo().defaultContent();
//         driver.switchTo().frame("entryIframe");

//         driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(3));
//         WebElement searchBox2 = driver.findElement(By.className("A_cdD"));
//         log.info("---------------------");
//         log.info(searchBox2.getText()); 
//   }
// }
