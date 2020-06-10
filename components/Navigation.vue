<template>
	<div id="navigation-wrapper">
		<nuxt-link id="home" to="/">
			<img id="home-icon" src="/icons/home.svg" alt="home">
		</nuxt-link>
		<nuxt-link id="time" to="/" v-text="time"></nuxt-link>
		<img id="theme" src="/icons/sun.svg" alt="theme" @click="toggleTheme">
	</div>
</template>

<script>
import moment from 'moment'
export default {
	name: "Navigation",
	data() {
		return {
			time: `${moment().format("LL")} ${moment().format("LTS")}`,
			scroll_old: 0,
			scroll_new: 0
		}
	},
	created() {
		setInterval(() => {
			this.time = `${moment().format("LL")} ${moment().format("LTS")}`
		}, 1000);
	},
	methods: {
		toggleTheme: function() {
			this.$emit("toggle-theme")
		},
		handleScroll: function() {
			let y = window.scrollY;
			this.scroll_new = y;
			let nav_wrapper = document.getElementById("navigation-wrapper");
			if (this.scroll_new > this.scroll_old) {
				nav_wrapper.classList.add("nav-hidden");
				this.scroll_old = y
			} else if (this.scroll_new < this.scroll_old) {
				nav_wrapper.classList.remove("nav-hidden");
				this.scroll_old = y
			}
		}
	},
	mounted() {
		window.addEventListener('scroll', this.handleScroll);
	}
}
</script>

<style lang="sass">
#navigation-wrapper
	@include flexCenter
	justify-content: space-between
	background: var(--gray-two)
	border-radius: 0 0 0.25rem 0.25rem
	position: fixed
	top: 0
	width: 100%
	z-index: 5
	margin: 0 auto
	&.nav-hidden
		top: -3rem
	#home
		margin: 0 0.5rem 0 0.5rem
		#home-icon
			height: 1.25rem
			width: 1.25rem
			padding: 0.5rem
			filter: var(--theme-icon)
			box-sizing: content-box
	#time
		padding: 0.5rem
		flex: 1
		text-decoration: none
		@include flexCenter
	#theme
		height: 1.25rem
		width: 1.25rem
		cursor: pointer
		padding: 0.5rem
		margin: 0 0.5rem 0 0.5rem
		filter: var(--theme-icon)
		box-sizing: content-box
</style>
