package com.swit.domain;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "study")
@Getter
@ToString(exclude = "imageList")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Study {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer studyNo;
    private String user_id;
    private String studyTitle;
    private String studyContent;
    private String studyType;
    private LocalDate studyStartDate;
    private LocalDate studyEndDate;
    private Integer studyHeadcount;
    private Boolean studyOnline;
    private String studySubject;
    private String studyComm;
    private String studyLink;
    private String studyUuid;

    @ElementCollection
    @Builder.Default
    private List<StudyImage> imageList = new ArrayList<>();

    @OneToOne(mappedBy = "study", cascade = CascadeType.ALL, orphanRemoval = true)
    private Question question;

    // Setter methods for updating fields
    public void setStudyTitle(String studyTitle) {
        this.studyTitle = studyTitle;
    }

    public void setStudyContent(String studyContent) {
        this.studyContent = studyContent;
    }

    public void setStudyType(String studyType) {
        this.studyType = studyType;
    }

    public void setStudyStartDate(LocalDate studyStartDate) {
        this.studyStartDate = studyStartDate;
    }

    public void setStudyEndDate(LocalDate studyEndDate) {
        this.studyEndDate = studyEndDate;
    }

    public void setStudyHeadcount(Integer studyHeadcount) {
        this.studyHeadcount = studyHeadcount;
    }

    public void setStudyOnline(Boolean studyOnline) {
        this.studyOnline = studyOnline;
    }

    public void setStudySubject(String studySubject) {
        this.studySubject = studySubject;
    }

    public void setStudyComm(String studyComm) {
        this.studyComm = studyComm;
    }

    public void setStudyLink(String studyLink) {
        this.studyLink = studyLink;
    }

    public void setStudyUuid(String studyUuid) {
        this.studyUuid = studyUuid;
    }

    // Methods for managing images
    public void addImage(StudyImage image) {
        image.setOrd(this.imageList.size());
        imageList.add(image);
    }

    public void addImageString(String fileName) {
        StudyImage studyImage = StudyImage.builder().fileName(fileName).build();
        addImage(studyImage);
    }

    public void clearList() {
        this.imageList.clear();
    }
}
// package com.swit.domain;

// import java.time.LocalDate;
// import java.util.ArrayList;
// import java.util.List;

// import jakarta.persistence.ElementCollection;
// import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.Table;
// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Data;
// import lombok.Getter;
// import lombok.NoArgsConstructor;
// import lombok.ToString;

// @Entity
// @Table(name = "study")
// @Getter
// @ToString(exclude ="imageList")
// @Data
// @Builder
// @AllArgsConstructor
// @NoArgsConstructor
// public class Study {
// @Id
// @GeneratedValue(strategy = GenerationType.IDENTITY)
// private Integer studyNo;
// private String user_id;
// private String studyTitle;
// private String studyContent;
// private String studyType;
// private LocalDate studyStartDate;
// private LocalDate studyEndDate;
// private Integer studyHeadcount;
// private Boolean studyOnline;
// private String studySubject;
// private String studyComm;
// private String studyLink;
// private String studyUuid;

// @ElementCollection
// @Builder.Default
// private List<StudyImage> imageList = new ArrayList<>();
// }
