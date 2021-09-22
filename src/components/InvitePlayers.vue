<template>
  <div class="oc-invite_player">
    <CreateGame />
    <div class="friends">
      <div class="request_friend">
        <it-button @click="addFriendClickHander" :text="showAddFriends" :outlined="!showAddFriends">
          <it-input
            v-if="showAddFriends"
            placeholder="Name of the User to add"
            :value="addFriendInput"
            @input="updateFriendInput"
          />
          <span v-if="!showAddFriends">Add Friend</span>
          <it-icon name="person_add" class="material-icons-two-tone" />
        </it-button>
      </div>
      <div class="friends_requests" v-for="friend in friendRequests" :key="friend.id">
        <h3>Friend request</h3>
        <div class="friend">
          <span>{{ friend.getFriend().get("username") }}</span>
          <div>
            <span class="handle_request">
              <it-button
                icon="cancel"
                text
                @click="handleFriendRequest(friend.getFriend().get('username'), false)"
              />
              <it-button
                icon="check_circle"
                text
                @click="() => handleFriendRequest(friend.getFriend().get('username'), true)"
              />
            </span>
            <Avatar
              :color="friend.getFriend().get('color')"
              :text="friend.getFriend().get('username')"
            />
          </div>
        </div>
      </div>
      <it-divider v-if="friendRequests.length > 0" />
      <div class="showWrapper" v-if="friends.length > 0">
        <div class="friends_list">
          <div class="friend" v-for="friend in friends" :key="friend.id">
            <span>{{ friend.get("username") }}</span>
            <div class="userHandle">
              <it-tag class="challenge" @click="challengeFriend(friend.get('username'))"
                >Challenge</it-tag
              >
              <Avatar :color="friend.get('color')" :text="friend.get('username')" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import CreateGame from "./CreateGame.vue"
import Avatar from "./Avatar.vue"
import { ref } from "vue"
import {
  getCurrentUser,
  sendFriendRequest,
  answerFriendRequest,
  getFriends,
  getFriendRequest,
  createGameWithCurrent,
  checkFriendRequest,
  FriendRequestStatus,
} from "../util/parse"

export default {
  name: "InvitePlayers",
  components: {
    CreateGame,
    Avatar,
  },
  setup() {
    return {
      friends: ref([]),
      showAddFriends: ref(false),
      addFriendInput: "",
      invitePlayerModal: ref(false),
      friendRequests: ref([]),
    }
  },
  async mounted() {
    await this.updateFriends()
    await checkFriendRequest()
  },
  methods: {
    async addFriendClickHander(ev) {
      const srcElement = ev.srcElement
      const clickedOnInput = srcElement.className === "it-input"

      if (!clickedOnInput) {
        if (srcElement.tagName === "I" && this.showAddFriends && this.addFriendInput === "")
          this.$Message.warning({ text: "Please add the name of the player you want to add" })
        else {
          this.showAddFriends = !this.showAddFriends
          if (!this.showAddFriends && this.addFriendInput !== "") {
            await sendFriendRequest(this.addFriendInput)
          }
        }
      }
    },
    async handleFriendRequest(name: string, acceptRequest: boolean): Promise<void> {
      const request = await answerFriendRequest(name, acceptRequest)
      if (request) this.$Message.success("Friend Added")
      else this.$Message.error("Couldn't add Friend")
      // update friendList
      await this.updateFriends()
    },
    async updateFriends() {
      const user = getCurrentUser()
      if (user) {
        const newFriends = await getFriends()
        if (newFriends && newFriends.length > 0) this.friends = newFriends

        const friends_requests = await getFriendRequest(user, FriendRequestStatus.pending)
        // set friendsequests
        if (friends_requests) this.friendRequests = friends_requests
      }
    },
    async updateFriendInput(ev) {
      this.addFriendInput = ev.currentTarget.value
    },
    async challengeFriend(name: string) {
      const newGame = await createGameWithCurrent(name)

      if (newGame) this.$router.push({ name: "game", params: { gameId: newGame } })
      else this.$message.danger({ text: "Error while rematching" })
    },
  },
}
</script>

<style lang="scss">
@import "../static/scss/vars.scss";
.oc-invite_player {
  .friends {
    margin-top: 15px;
    .request_friend {
      display: flex;
      justify-content: center;
      align-items: center;

      .it-icon {
        margin-left: 10px;
      }
      > button {
        box-shadow: none;
        .it-btn-text {
          align-items: center;
          color: $default-text-color;
          i {
            font-size: 20px;
          }
        }
        &.it-btn--outlined {
          background: transparent;
        }
      }
    }
    .friends_list,
    .friends_requests {
      .friend {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        > div {
          display: flex;
          align-items: center;

          .handle_request {
            margin-right: 30px;
            display: flex;

            .it-icon {
              font-size: 30px;
              margin: 0;
            }
          }
          &.userHandle .it-tag {
            margin-right: 10px;
            &:hover {
              cursor: pointer;
            }
          }
        }
      }
      > h3 {
        text-align: left;
        margin-bottom: 0;
      }
    }
  }
}
</style>
