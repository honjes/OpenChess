<template>
  <div class="oc-invite_player">
    <CreateGame />
    <div class="friends">
      <div class="friends_request">
        <it-button
          @click="showAddFriendClickHander"
          :text="showAddFriends"
          :outlined="!showAddFriends"
        >
          <it-input
            v-if="showAddFriends"
            placeholder="Name of the User to add"
            v-model="addFriendInput"
          />
          <span v-if="!showAddFriends">Add Friend</span>
          <it-icon name="person_add" />
        </it-button>
      </div>
      <div class="friends_requests" v-for="friend in friendRequests" :key="friend.id">
        <div class="friend">
          <span>{{ friend.get("username") }}</span>
          <Avatar :color="friend.get('color')" :text="friend.get('username')" />
        </div>
      </div>
      <it-divider v-if="friendRequests.length > 0" />
      <div class="showWrapper" v-if="friends.length > 0">
        <div class="friends_list" v-for="friend in friends" :key="friend.id">
          <div class="friend">
            <span>{{ friend.get("username") }}</span>
            <Avatar :color="friend.get('color')" :text="friend.get('username')" />
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
import { getCurrentUser, sendFriendRequest, currentFriendRequests, getFriends } from "../util/parse"

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
      addFriendInput: ref(""),
      invitePlayerModal: ref(false),
      friendRequests: ref([]),
    }
  },
  async mounted() {
    const user = getCurrentUser()
    if (user) {
      const newFriends = await getFriends(user.id)
      if (newFriends && newFriends.length > 0) this.friends = newFriends

      const friends_requests = await currentFriendRequests()
      if (friends_requests && friends_requests.length > 0) this.friendRequests = friends_requests
    }
  },
  methods: {
    async showAddFriendClickHander(ev) {
      console.log("ev.srcElement: ", ev.srcElement)
      const srcElement = ev.srcElement
      const clickedOnInput = srcElement.className === "it-input"

      if (!clickedOnInput) {
        if (srcElement.tagName === "I" && this.showAddFriends)
          this.$Message.warning({ text: "Please add the name of the player you want to add" })
        else {
          this.showAddFriends = !this.showAddFriends
          if (!this.showAddFriends && this.addFriendInput !== "") {
            await sendFriendRequest(this.addFriendInput)
          }
        }
      }
    },
  },
}
</script>

<style lang="scss">
@import "../static/scss/vars.scss";
.oc-invite_player {
  .friends {
    margin-top: 15px;
    .friends_request {
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
      }
    }
  }
}
</style>
