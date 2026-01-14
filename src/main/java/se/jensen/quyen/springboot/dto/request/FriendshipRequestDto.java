package se.jensen.quyen.springboot.dto.request;

public class FriendshipRequestDto {

    private Long requesterUserId;
    private Long addresseeUserId;

    public Long getRequesterUserId() {
        return requesterUserId;
    }

    public Long getAddresseeUserId() {
        return addresseeUserId;
    }
}
