package org.example.workers_backend_services.Service;

import org.example.workers_backend_services.DTO.CategoryResponseDTO;
import org.example.workers_backend_services.DTO.ReviewRequestDTO;
import org.example.workers_backend_services.DTO.ReviewResponseDTO;
import org.example.workers_backend_services.Entity.*;
import org.example.workers_backend_services.Repository.Reviews_Request_Repository;
import org.example.workers_backend_services.Repository.Service_Request_Repository;
import org.example.workers_backend_services.Repository.UserRepository;
import org.example.workers_backend_services.Repository.Worker_profileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class Review_Services {

    @Autowired
    private Reviews_Request_Repository reviewRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Worker_profileRepository workerProfileRepository;
    @Autowired
    private Service_Request_Repository serviceRequestRepository;
    // 1. Create a new review
    public ReviewResponseDTO createReview(ReviewRequestDTO review) {
        // Set the timestamp automatically before saving
        Users customer=userRepository.findById(review.getCustomerId())
                .orElseThrow(()->new RuntimeException("Customer not found"+review.getCustomerId()));
        Worker_profile worker=workerProfileRepository.findById(review.getWorkerId())
                .orElseThrow(()->new RuntimeException("No worker found of id"+review.getWorkerId()));
        Service_request serviceRequest=serviceRequestRepository.findById(review.getServiceRequestId())
                .orElseThrow(()->new RuntimeException("No request found with"+review.getServiceRequestId()));

        Reviews rev=new Reviews();
        rev.setCustomer(customer);
        rev.setWorker(worker);
        rev.setServiceRequest(serviceRequest);
        rev.setRating(review.getRating());
        rev.setReviewText(review.getReviewText());
        rev.setCreatedAt(LocalDateTime.now());

        Reviews saved=reviewRepository.save(rev);
        return convertToDTO(saved);
    }

    // 2. Get all reviews
    public List<ReviewResponseDTO> getAllReviews() {
          return reviewRepository.findAll().stream()
                  .map(this::convertToDTO)
                  .collect(Collectors.toList());
    }

    // 3. Get a specific review by ID
    public Optional<ReviewResponseDTO> getReviewById(Long id) {
            return reviewRepository.findById(id).map(this::convertToDTO);
    }

    // 4. Update an existing review
    public Optional<ReviewResponseDTO> updateReview(Long id, ReviewRequestDTO dto) {

        return reviewRepository.findById(id).map(existingreview->{
            if(dto.getRating()!=null){
                existingreview.setRating(dto.getRating());
            }
            if(dto.getReviewText()!=null){
                existingreview.setReviewText(dto.getReviewText());
            }
            return convertToDTO(reviewRepository.save(existingreview));
        });
    }

    // 5. Delete a review
    public boolean deleteReview(Long id) {
        if (reviewRepository.existsById(id)) {
            reviewRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private ReviewResponseDTO convertToDTO(Reviews reviews){
        return new ReviewResponseDTO(
                reviews.getReviewId(),
                reviews.getCustomer().getUser_name(),
                reviews.getWorker().getUsers().getUser_name(),
                reviews.getServiceRequest().getService_id(),
                reviews.getRating(),
                reviews.getReviewText(),
                reviews.getCreatedAt()
        );
    }
}