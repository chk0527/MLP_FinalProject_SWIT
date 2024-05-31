package com.swit.repository;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.interactions.Actions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.swit.domain.PlaceEntity;

import lombok.extern.log4j.Log4j2;

@Log4j2
@SpringBootTest
public class placeData {
  @Autowired
  private PlaceRepository placeRepository;

  @Test
  public void testGoogleSearch() throws InterruptedException {
    // Optional. If not specified, WebDriver searches the PATH for chromedriver.
    // System.setProperty("webdriver.chrome.driver", "/path/to/chromedriver");
    long count = 0;
    ChromeOptions options = new ChromeOptions();
    // options.addArguments("--headless");

    WebDriver driver = new ChromeDriver(options);

    driver.get("https://map.naver.com/p/search/경기도%20스터디카페"); // 네이버장소 검색창에 스터디 검색
    // Thread.sleep(5000);
    // Let the user actually see something!

    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
    driver.switchTo().frame("searchIframe"); // 첫번쨰 프레임 선택

    // 스크롤 끝까지 내리기
    WebElement scroll = driver.findElement(By.cssSelector("#_pcmap_list_scroll_container"));

    for (int i = 0; i < 15; i++) {
      scroll.click();
      new Actions(driver).sendKeys(Keys.END).perform();
    }

    // 첫번째 가게 선택
    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
    List<WebElement> searchBoxs = driver.findElements(By.className("YwYLL"));
    log.info("---------------------------------------------------------------------");
    log.info(searchBoxs.size());

    for (WebElement searchBox : searchBoxs) {
      // 첫번쨰 프레임 선택
      driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
      driver.switchTo().defaultContent();
      driver.switchTo().frame("searchIframe");

      // 선택한 메뉴 클릭
      driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
      searchBox.click();

      // 두번째 프레임 선택
      driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
      driver.switchTo().defaultContent(); // 프레임 초기화
      driver.switchTo().frame("entryIframe");

      // 가게이름 가져오기
      driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
      WebElement name = driver.findElement(By.className("GHAhO"));
      String placeName = name.getText();
      log.info("상호명: " + placeName);

      // 주소 가져오기
      driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
      WebElement addr = driver.findElement(By.className("LDgIH"));
      String placeAddr = addr.getText();
      log.info("주소: " + placeAddr);

      // 운영시간
      driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
      List<WebElement> Expand1 = driver.findElements(By.cssSelector("div.O8qbU.pSavy > div > a > div > div > span > svg"));
      if(Expand1.size()!=0){
        Expand1.get(0).click();
      }

      driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
      List<WebElement> time1 = driver.findElements(By.className("i8cJw"));
      List<WebElement> time2 = driver.findElements(By.className("H3ua4"));
      String placeTime = "";
      for (int i = 0; i < time1.size(); i++) {
        placeTime += time1.get(i).getText() + " " + time2.get(i).getText() + "\n";
      }
      log.info("운영시간: " + placeTime);

      // 전화번호 가져오기
      driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
      List<WebElement> tel = driver.findElements(By.className("xlx7Q"));
      String placeTel = "";
      if(tel.size()!=0) {
        placeTel = tel.get(0).getText();
      }
      log.info("전화번호: " + placeTel);

      // 이미지 가져오기
      driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
      WebElement img = driver.findElement(By.className("K0PDV"));
      String placeImg = img.getAttribute("style").replace("width: 100%; height: 100%; background-image: url(\"", "")
          .replace("width: 100%; height: 100%; background-position: 50% 0px; background-image: url(\"", "")
          .replace("\");", "");
      log.info("이미지: " + placeImg);



      // 메뉴 가져오기
      driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
      List<WebElement> Expand2 = driver.findElements(By.cssSelector("div.crtyj > a"));
      if(Expand2.size()!=0){
        Expand2.get(0).click();
      }
      driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
      List<WebElement> menus1 = driver.findElements(By.className("li2Pi")); // 메뉴 목록 리스트화
      List<WebElement> menus2 = driver.findElements(By.className("CLSES")); // 메뉴 목록 리스트화

      String placeMenu = "";
      for (int i = 0; i < menus1.size(); i++) {
        placeMenu += menus1.get(i).getText() + " " + menus2.get(i).getText() + "\n";
      }
      log.info("메뉴: " + placeMenu);

      //db저장
      PlaceEntity place = PlaceEntity.builder()
      .place_name(placeName).place_addr(placeAddr)
      .place_tel(placeTel).place_time(placeTime)
      .place_Img(placeImg).place_detail(placeMenu)
      .build();

      placeRepository.save(place);

      count++;
      log.info(count+1);
      log.info("---------------------------------------------------------------------");

    }

    driver.quit();
  }
}
