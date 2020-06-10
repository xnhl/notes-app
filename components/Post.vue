<template>
	<div class="post" :data-id="this.info.id">
		<a class="post-title" :class="{ 'linked': this.link }" v-if="this.link" :href="`/${this.info.id}`" v-text="this.info.title"></a>
		<p class="post-title" contenteditable="true" @input="updateTitle" @keyup.enter="updatePost" v-if="!this.link" v-text="this.info.title"></p>
		<p class="post-body" contenteditable="true" @input="updateBody" @keyup.enter="updatePost" v-text="this.info.body"></p>
		<p class="post-time" v-text="this.info.timestamp"></p>
		<div class="post-buttons">
			<div class="post-button" id="delete" @click="deletePost">
				<img class="post-button-image" src="/icons/x.svg" />
			</div>
			<div class="post-button" id="save" @click="updatePost">
				<img class="post-button-image" src="/icons/save.svg" />
			</div>
			<div class="post-button" id="copy" @click="copyNote">
				<img class="post-button-image" src="/icons/copy.svg" />
			</div>
		</div>
	</div>
</template>

<script>
import low from 'lowdb'
import moment from 'moment'
import LocalStorage from 'lowdb/adapters/LocalStorage'
export default {
	name: "Post",
	props: {info: Object, link: false},
	data() {
		return {
			time: `${moment().format("LL")} ${moment().format("LTS")}`,
			timeShort: moment().format("LTS"),
			title: this.info.title,
			body: this.info.body
		}
	},
	methods: {
		updateTitle: function(e) {
			let newTitle = e.target.textContent;
			this.title = newTitle
		},
		updateBody: function(e) {
			let newBody = e.target.textContent;
			this.body = newBody
		},
		deletePost: function() {
			const adapter = new LocalStorage('db');
			const db = low(adapter);
			db.get('posts')
				.remove({ id: this.info.id })
				.write();
			this.$emit('postDelete', this.info.id)
		},
		copyNote: function() {
			const copy = require('copy-text-to-clipboard');
			copy(`${this.info.title} (${this.info.timestamp}): ${this.info.body}`)
		},
		updatePost: function(e) {
			e.target.blur();
			const adapter = new LocalStorage('db');
			const db = low(adapter);
			db.get('posts')
				.find({ id: this.info.id })
				.assign({ title: this.title, body: this.body })
				.write();
			this.$emit("postUpdate", this.info.id)
		}
	}
}
</script>

<style lang="sass">
.post
	@include flexCenter
	position: relative
	animation: fadeIn 0.3s ease-in-out
	flex: 1
	overflow: hidden
	margin: 0.5rem
	border-radius: 0.25rem
	@include flexCenter
	flex-direction: column
	background: var(--gray-three)
	box-shadow: var(--theme-boxShadowLight)
	@media (min-width: 32em)
		min-width: 40%
		max-width: 55%
	&:hover
		box-shadow: var(--theme-boxShadowLight)
	.post-buttons
		@include flexCenter
		position: absolute
		bottom: 0
		left: 0
		padding: 0.25rem
		.post-button
			@include flexCenter
			.post-button-image
				height: 1rem
				width: 1rem
				box-sizing: content-box
				filter: var(--theme-icon)
		#save
			cursor: pointer
			margin: 0.1rem
			padding: 0.25rem
			border-radius: 0.25rem
			background: rgba(green, 0.25)
			&:hover
				background: rgba(green, 0.5)
		#delete
			margin: 0.1rem
			padding: 0.25rem
			cursor: pointer
			border-radius: 0.25rem
			background: rgba(red, 0.25)
			&:hover
				background: rgba(red, 0.5)
		#copy
			margin: 0.1rem
			padding: 0.25rem
			cursor: pointer
			border-radius: 0.25rem
			background: rgba(blue, 0.25)
			&:hover
				background: rgba(blue, 0.5)
	.post-title
		@include flexCenter
		min-width: 100%
		padding: 1rem
		font-size: 1.25rem
		text-decoration: none
		color: var(--theme-black)
		background: var(--gray-four)
		&.linked
			cursor: pointer
	.post-body
		@include flexCenter
		min-width: 100%
		padding: 1.5rem
		flex: auto
		text-indent: 0.5rem
		word-break: break-word
	.post-time
		@include flexCenter
		padding: 0.25rem
		width: 100%
		justify-content: flex-end
		font-size: 0.75rem
		color: var(--theme-black)
</style>
