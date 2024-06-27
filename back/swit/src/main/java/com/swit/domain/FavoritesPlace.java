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
@Table(name = "favorites_place")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FavoritesPlace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "favorites_Place_no")
    private Long favoritesPlaceNo;

    @ManyToOne
    @JoinColumn(name = "user_id",referencedColumnName="userId", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "Place_no",referencedColumnName="PlaceNo", nullable = false)
    private Place place;

}
