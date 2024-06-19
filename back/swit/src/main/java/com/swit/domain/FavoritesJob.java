package com.swit.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "favorites_job")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FavoritesJob {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "favorites_job_no")
    private Long favoritesJobNo;

    @ManyToOne
    @JoinColumn(name = "user_id",referencedColumnName="userId", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "job_no",referencedColumnName="jobNo", nullable = false)
    private Job job;

}
