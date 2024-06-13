package com.swit.domain;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.mapping.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
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
    private String userId;
    private String studyTitle;
    private String studyContent;
    private String studyAddr;
    private String studyType;
    private LocalDate studyStartDate;
    private Integer studyHeadcount;
    private Boolean studyOnline;
    private String studySubject;
    private String studyUuid;

    @ElementCollection
    @Builder.Default
    private List<StudyImage> imageList = new ArrayList<>();

    @OneToOne(mappedBy = "study", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Question question;

    @ManyToMany
    @JoinTable(name = "group1", joinColumns = @JoinColumn(name = "study_no"), inverseJoinColumns = @JoinColumn(name = "user_no"))
    private List<User> users; 

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