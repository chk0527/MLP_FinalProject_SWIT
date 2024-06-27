// package com.swit.repository;

// import java.time.LocalDateTime;
// import java.util.Optional;

// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.context.SpringBootTest;

// import com.swit.domain.Calendar;
// import com.swit.domain.User;

// import lombok.extern.log4j.Log4j2;

// @Log4j2
// @SpringBootTest
// public class CalendarRepositoryTest {
//     @Autowired
//     private CalendarRepository calendarRepository;

//     @Test
//     public void test() {
//         log.info("---------------------");
//         log.info(calendarRepository);
//     }

//     @Test
//     public void testInsert() {
//         Calendar calendar = Calendar.builder()
//             .calendarNo(null).study(null)
//             .content(null).startDate(null)
//             .endDate(null).completeChk(false)
//             .build();

//             calendarRepository.save(calendar);
//     }
// }
