<!-- 日期 -->
<template>
	<div class='cc-date'>
		<div class='cc-date-head'>
			<i class='el-icon-arrow-left' @click='prevMonth' v-if='ifChangeMonth'></i>
			{{year}}年{{month}}月
			<i class='el-icon-arrow-right' @click='nextMonth' v-if='ifChangeMonth'></i>
		</div>
		<div class='cc-date-week'>
			<div class='item'>日</div>
			<div class='item'>一</div>
			<div class='item'>二</div>
			<div class='item'>三</div>
			<div class='item'>四</div>
			<div class='item'>五</div>
			<div class='item'>六</div>
		</div>
		<div class='cc-date-day'>
			<div v-for='(item,index) in dayList' :key='index' class="item">
				<slot :name="year+'-'+month+'-'+item" :date='{year: year, month: month, day: item}'></slot>
				<span class='day'>{{item}}</span>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'cc-date',
		props: ['ifChangeMonth'],
		data() {
			let today = new Date()
			return {
				dayList: [],
				year: today.getFullYear(),
				month: today.getMonth() + 1
			}
		},
		methods: {
			// 获取date的第一天
			getFirstDate() {
				return new Date(this.year, this.month -1 , 1);
			},
			// 获取date的最后一天
			getLastDate() {
				let nextMonthFirstDay = new Date(this.year, this.month, 1),
					oneDay = 1000*60*60*24;
				return new Date(nextMonthFirstDay-oneDay);
			},
			// 初始化dayList
			initDayList() {
				let monthFirstDay = this.getFirstDate(),
					monthLastDay = this.getLastDate(),
					firstDayweekDay = monthFirstDay.getDay(),
					lastDay = monthLastDay.getDate(),
					days = [];
				while(firstDayweekDay--) {
					days.push('')
				}
				for(let i = 1; i <= lastDay; i++) {
					days.push(i)
				}
				for(let i = days.length; i < 42; i++) {
					days.push('')
				}
				this.dayList = days;
			},
			// 上一个月
			prevMonth() {
				if(1 == this.month) {
					this.year -= 1;
					this.month = 12;
				} else {
					this.month -= 1;
				}
				this.initDayList()
				this.$emit('monthChange', {year: this.year, month: this.month})
			},
			// 下一个月
			nextMonth() {
				if(12 == this.month) {
					this.year += 1;
					this.month = 1;
				} else {
					this.month += 1;
				}
				this.initDayList()
				this.$emit('monthChange', {year: this.year, month: this.month})
			},
			getDayList() {
				let i = this.dayList.length,
					arr = [];
				while(i--) {
					if(this.dayList[i]) {
						arr.unshift(this.dayList[i])
					}
				}
				return arr;
			}
		},
		mounted() {
			this.initDayList()
		}
	}
</script>
<style lang="stylus">
	.cc-date
		width: 700px
		background: #fff
		.cc-date-head
			height: 30px
			line-height: 30px
			background-color: #1cbba7
			text-align: center
			color: #fff
			font-size: 16px !important
			i
				font-size: 20px !important
				line-height: 30px
				cursor: pointer
			.el-icon-arrow-left
				float: left
				margin-left: 10px
			.el-icon-arrow-right
				float: right
				margin-right: 10px
		.cc-date-week, .cc-date-day
			font-size: 0 !important
			height: 30px
			width: 100%
			:before
				display: inline-block
				content: ' '
				visibility: hidden
				height: 100%
				vertical-align: middle
			.item:first-child
				border-left: 1px solid #eee
		.cc-date-week .item
			background-color: #f2f2f2
		.cc-date-day
			height: auto
			.item
				height: 60px
			.item:nth-child(7n+1)
				border-left: 1px solid #eee
		.item
			box-sizing: border-box
			width: 100px
			border-bottom: 1px solid #eee
			border-right: 1px solid #eee
			display: inline-block
			font-size: 12px !important
			height: 100%
			vertical-align: middle
			text-align:center
			cursor: pointer
			position: relative
			&.active
				background-color: #f90 !important
			.day 
				height: 20px
				bottom: 0
				width: 100%
				line-height: 20px
				display: block
				left: 0
				position: absolute
				font-size: 14px !important
			.el-checkbox__label
				display: none
</style>
