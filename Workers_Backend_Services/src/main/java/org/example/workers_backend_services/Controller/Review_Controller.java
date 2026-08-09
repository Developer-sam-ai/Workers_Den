package org.example.workers_backend_services.Controller;

import jakarta.validation.Valid;
import org.example.workers_backend_services.DTO.ReviewRequestDTO;
import org.example.workers_backend_services.DTO.ReviewResponseDTO;
import org.example.workers_backend_services.Entity.Reviews;
import org.example.workers_backend_services.Service.Review_Services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class Review_Controller {

    @Autowired
    Review_Services services;

    @PostMapping
    public ResponseEntity<ReviewResponseDTO> createReview(@RequestBody ReviewRequestDTO review) {
        ReviewResponseDTO savedReview = services.createReview(review);
        return new ResponseEntity<>(savedReview, HttpStatus.CREATED);
    }

    // 2. Get all reviews
    @GetMapping
    public ResponseEntity<List<ReviewResponseDTO>> getAllReviews() {
        List<ReviewResponseDTO> reviews = services.getAllReviews();
        return ResponseEntity.ok(reviews);
    }

    // 3. Get a specific review by ID
    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponseDTO> getReviewById(@PathVariable Long id) {
        Optional<ReviewResponseDTO> review = services.getReviewById(id);
        return review.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 4. Update an existing review
    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponseDTO> updateReview(@PathVariable Long id,@Valid  @RequestBody ReviewRequestDTO reviewDetails) {
        Optional<ReviewResponseDTO> updatedReview = services.updateReview(id, reviewDetails);
        return updatedReview.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 5. Delete a review
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        if (services.deleteReview(id)) {
            return ResponseEntity.noContent().build(); // 204 No Content for successful deletion
        }
        return ResponseEntity.notFound().build(); // 404 Not Found if the ID doesn't exist
    }
}
