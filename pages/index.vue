<template>
	<div id="main-wrapper">
		<div id="add-post">
			<div id="title">
				<label id="title-label" for="title">Title</label>
				<input id="title-text" type="text" name="title" placeholder="input text here">
			</div>
			<div id="body">
				<label id="body-label" for="body">Body</label>
				<textarea id="body-text" type="text" name="body" rows="5" placeholder="input text here" @keyup.enter="write"></textarea>
			</div>
			<p id="enter-post" @click="write">Add</p>
			<div id="options">
				<div id="save" class="options-option">
					<p class="save-title">Save As: </p>
					<p class="save-text" @click="saveText">Text</p>
					<p class="save-text" @click="save">JSON</p>
				</div>
				<div id="load" class="options-option">
					<p id="load-text">Load (JSON)</p>
					<div id="load-input-wrapper">
						<input type="file" id="load-input" @change="loadFile" accept=".json">
					</div>
				</div>
				<div id="search" class="options-option">
					<p id="search-title">Search: </p>
					<input type="text" @change="search" @input="search" id="search-input">
				</div>
			</div>
		</div>
		<div id="posts-wrapper">
			<Post v-for="(post, index) in posts" :key="index" :info="post" @postUpdate="updateList" @postDelete="updateList" />
		</div>
	</div>
</template>

<script>
import low from 'lowdb'
import moment from 'moment'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import Post from '@/components/Post'
export default {
	components: {Post},
	data() {
		return {
			posts: Array,
			time: `${moment().format("LL")} ${moment().format("LTS")}`
		}
	},
	computed: {
		sortedPosts: function() {
			let sorted = [...this.posts]
			let reversed = sorted.reverse()
			return reversed
		}
	},
	methods: {
		search: function() {
			let posts = [...document.getElementById("posts-wrapper").children]
			let searchValue = document.getElementById("search-input").value
			for (let post of posts) {
				let title = post.children[1].textContent.toLowerCase()
				let body = post.children[2].textContent.toLowerCase()
				if (title.indexOf(searchValue) > -1 || body.indexOf(searchValue) > -1) {
					post.classList.remove("hide")
				} else post.classList.add("hide")
			}
		},
		write: function() {
			const adapter = new LocalStorage('db')
			const db = low(adapter)
			const nanoid = require("nanoid")
			let title = document.getElementById("title-text")
			let titleText = title.value.toString()
			let body = document.getElementById("body-text")
			let bodyText = body.value.toString()
			if (titleText == "" || bodyText == "") {
				console.log("empty")
				// show modal saying that there needs to be text
			} else {
				db.get('posts')
					.unshift({
						id: nanoid(),
						timestamp: moment().format("LLLL"),
						title: titleText,
						body: bodyText 
					})
					.write()
				let allPosts = db.get('posts').value()
				this.posts = allPosts
				title.value = ""
				body.value = ""
			}
		},
		updateList: function(id) {
			const adapter = new LocalStorage('db')
			const db = low(adapter)
			let existing = db.get('posts').value()
			this.posts = existing
		},
		addRandom: function() {
			const adapter = new LocalStorage('db')
			const db = low(adapter)
			const nanoid = require("nanoid")
			let list = db.get('posts').value()
			let defaultList = [
				{
					title: "Rerum, velit molestias",
					body: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rerum, velit molestias eveniet, animi ipsum praesentium ea voluptatibus necessitatibus eius amet incidunt quod odio vero saepe."
				},
				{
					title: "Laborum itaque maxime saepe",
					body: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum itaque maxime saepe nihil. Laboriosam, eos neque? Recusandae doloremque praesentium enim vero, asperiores ratione soluta ad."
				},
				{
					title: "Beatae numquam repudiandae recusandae",
					body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae numquam repudiandae recusandae libero. Numquam in illo ratione porro unde amet omnis incidunt sed aut quos."
				},
				{
					title: "Nihil provident ipsam,",
					body: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil provident ipsam, iste, commodi suscipit assumenda dolore sequi architecto veniam totam magni aspernatur est consequuntur eligendi."
				},
				{
					title: "Rerum dolor eaque similique",
					body: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rerum dolor eaque similique fugiat? Corrupti et ipsam eligendi quae, ducimus quaerat ea doloremque! Earum, eaque molestias!"
				},
				{
					title: "Possimus illum est ullam",
					body: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Possimus illum est ullam, dolorum ipsa ipsam? Expedita quae dolores doloremque dolorum impedit placeat nostrum modi odio."
				},
				{
					title: "Assumenda, sed,",
					body: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda, sed, numquam rerum nihil est quis sint temporibus voluptatem, at aliquam labore deleniti facilis fugit suscipit!"
				},
				{
					title: "Nisi unde a nihil",
					body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nisi unde a nihil exercitationem? Impedit nulla consectetur temporibus aspernatur veniam maxime similique libero fugiat, maiores laboriosam?"
				},
				{
					title: "Laborum magnam placeat enim",
					body: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laborum magnam placeat enim, ipsa accusantium facilis necessitatibus. Optio doloremque assumenda, facilis necessitatibus ducimus unde ab error?"
				},
				{
					title: "Nulla aspernatur facilis ipsam",
					body: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla aspernatur facilis ipsam deleniti, itaque doloremque nam iusto consectetur sequi quae ipsum ipsa veritatis cumque molestias."
				},
			]
			for (let i = 0; i < 10; i++) {
				list.unshift({
					id: nanoid(),
					timestamp: moment().add(i, "hours").format("LLLL"),
					title: defaultList[i].title,
					body: defaultList[i].body
				})
			}
			db.get('posts')
				.assign({ posts: list })
				.write()
			let newList = db.get('posts').value()
			this.posts = newList
		},
		save: function() {
			var FileSaver = require('file-saver')
			const adapter = new LocalStorage('db')
			const db = low(adapter)
			let list = db.get('posts').value()
			let stringed = JSON.stringify(list)
			var blob = new Blob([stringed], {type: "application/json"})
			FileSaver.saveAs(blob, "test.json")
		},
		saveText: function() {
			var FileSaver = require('file-saver')
			const adapter = new LocalStorage('db')
			const db = low(adapter)
			let list = db.get('posts').value()
			let stringed = list.map(each => {
				let title = each.title.replace(/\r|\n/gi, "")
				let body = each.body.replace(/\r|\n/gi, "")
				let timestamp = each.timestamp
				return `${title} (${timestamp}) - ${body}\r\n\r\n`
			})
			var blob = new Blob(stringed, {type: "text/plain"})
			FileSaver.saveAs(blob, "test.txt")
		},
		loadFile: async function(input) {
			const adapter = new LocalStorage('db')
			const db = low(adapter)
			const selectedFile = document.getElementById('load-input').files[0]
			let reader = new FileReader()
			reader.onload = (event) => {
				let res = JSON.parse(event.target.result)
				this.posts = res
				db.set('posts', res)
					.write()
			}
			reader.readAsText(selectedFile)
		}
	},
	mounted() {
		const adapter = new LocalStorage('db')
		const db = low(adapter)
		const nanoid = require("nanoid")
		if (db.has('posts').value()) {
			let existing = db.get('posts').value()
			this.posts = existing
		} else {
			let lorem = [
				{
					title: "Rerum, velit molestias",
					body: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rerum, velit molestias eveniet, animi ipsum praesentium ea voluptatibus necessitatibus eius amet incidunt quod odio vero saepe."
				},
				{
					title: "Laborum itaque maxime saepe",
					body: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum itaque maxime saepe nihil. Laboriosam, eos neque? Recusandae doloremque praesentium enim vero, asperiores ratione soluta ad."
				},
				{
					title: "Beatae numquam repudiandae recusandae",
					body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae numquam repudiandae recusandae libero. Numquam in illo ratione porro unde amet omnis incidunt sed aut quos."
				},
				{
					title: "Nihil provident ipsam,",
					body: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil provident ipsam, iste, commodi suscipit assumenda dolore sequi architecto veniam totam magni aspernatur est consequuntur eligendi."
				},
				{
					title: "Rerum dolor eaque similique",
					body: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rerum dolor eaque similique fugiat? Corrupti et ipsam eligendi quae, ducimus quaerat ea doloremque! Earum, eaque molestias!"
				},
				{
					title: "Possimus illum est ullam",
					body: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Possimus illum est ullam, dolorum ipsa ipsam? Expedita quae dolores doloremque dolorum impedit placeat nostrum modi odio."
				},
				{
					title: "Assumenda, sed,",
					body: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda, sed, numquam rerum nihil est quis sint temporibus voluptatem, at aliquam labore deleniti facilis fugit suscipit!"
				},
				{
					title: "Nisi unde a nihil",
					body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nisi unde a nihil exercitationem? Impedit nulla consectetur temporibus aspernatur veniam maxime similique libero fugiat, maiores laboriosam?"
				},
				{
					title: "Laborum magnam placeat enim",
					body: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laborum magnam placeat enim, ipsa accusantium facilis necessitatibus. Optio doloremque assumenda, facilis necessitatibus ducimus unde ab error?"
				},
				{
					title: "Nulla aspernatur facilis ipsam",
					body: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla aspernatur facilis ipsam deleniti, itaque doloremque nam iusto consectetur sequi quae ipsum ipsa veritatis cumque molestias."
				},
			]
			let list = []
			for (let each of lorem) {
				list.unshift({
					id: nanoid(),
					timestamp: moment().format("LLLL"),
					title: each.title,
					body: each.body
				})
			}
			db.defaults({ posts: list }).write()
			let newList = db.get('posts').value()
			this.posts = newList
		}
	}
}
</script>

<style lang="sass">
#main-wrapper
	@include pageWrapper
	position: relative
	padding: 0.25rem
	width: 100%
	#add-post
		@include flexCenter
		align-items: stretch
		margin: 1rem auto
		border-radius: 0.25rem
		overflow: hidden
		background: var(--gray-two)
		#title
			@include flexCenter
			flex: 1
			min-width: 100%
			#title-label
				@include flexCenter
				justify-content: flex-start
				padding: 0.25rem
				width: 100%
				margin-left: 0.25rem
				font-size: 0.9rem
			#title-text
				flex: 1
				margin: 0 0.25rem 0.25rem 0.25rem
				background: var(--gray-three)
				border: 0
				padding: 0.5rem
				color: var(--theme-black)
				border-radius: 0.25rem
				&::placeholder
					color: RGBA(var(--theme-black), 0.75)
		#body
			@include flexCenter
			flex: 1
			min-width: 100%
			#body-label
				@include flexCenter
				justify-content: flex-start
				padding: 0.25rem
				width: 100%
				margin-left: 0.25rem
				font-size: 0.9rem
			#body-text
				flex: 1
				margin: 0 0.25rem 0.25rem 0.25rem
				background: var(--gray-three)
				border: 0
				padding: 0.5rem
				color: var(--theme-black)
				border-radius: 0.25rem
				font-family: 'Roboto', sans-serif
				&::placeholder
					color: RGBA(var(--theme-black), 0.75)
		#enter-post
			width: 100%
			padding: 0.5rem
			margin: 0.25rem
			cursor: pointer
			@include flexCenter
			border-radius: 0.25rem
			background: var(--gray-four)
			&:hover
				background: var(--gray-three)
		#options
			@include flexCenter
			align-items: stretch
			width: 100%
			margin-top: 0.5rem
			.options-option
				width: auto
				flex-grow: 1
				margin: 0.25rem
				border-radius: 0.25rem
				background: var(--gray-three)
			#save
				@include flexCenter
				padding: 0.25rem
				.save-title
					padding: 0.25rem
				.save-text
					padding: 0.25rem 0.5rem
					margin: 0 0.25rem
					cursor: pointer
					background: var(--gray-five)
					border-radius: 0.25rem
					&:hover
						background: var(--gray-four)
			#load
				@include flexCenter
				padding: 0.25rem
				#load-text
					@include flexCenter
					padding: 0.25rem
					margin-right: 0.5rem
				#load-input-wrapper
					@include flexCenter
					text-align: center
				#load-input
					padding: 0.25rem
			#search
				@include flexCenter
				padding: 0.25rem
				#search-title
					margin-right: 0.5rem
					@include flexCenter
				#search-input
					color: black
	#posts-wrapper
		@include flexCenter
		align-items: stretch
		border-radius: 0.25rem
		overflow: hidden
		padding: 0.25rem
		background: var(--gray-two)
</style>
