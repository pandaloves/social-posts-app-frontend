package se.jensen.quyen.springboot.dto.response;

public class FriendshipResponseDto {

    private Long id;
    private String requester;
    private String addressee;
    private String status;

    public FriendshipResponseDto(Long id, String requester, String addressee, String status) {
        this.id = id;
        this.requester = requester;
        this.addressee = addressee;
        this.status = status;
    }

    // getters
}
