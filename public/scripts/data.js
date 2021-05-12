var testThreads = [
	{
		id: 1,
		title: "Thread 1",
		author: "Some Person",
		date: Date.now(),
		content: "Comment made by the creator of the thread. Wow, such and such game is great, other people should totally get it",
		comments: [
			{
				id: "1",
				author: "person 2",
				date: Date.now(),
				content: "No, you wrong, other game good, this game bad.",
				comments: [
					{
						id: "2",
						author: "person 3",
						date: Date.now(),
						content: "Yea i completely agree with this guy",
						comments: []
					}
				]
			},
			{
				id: "3",
				author: "another person",
				date: Date.now(),
				content: "Yea i completely agree with this guy, but what happens when the comment gets too long? Does it just push everything down, or is there a dynamic change? If there isn't a dynamic change, how to add one? Ok now double it: Yea i completely agree with this guy, but what happens when the comment gets too long? Does it just push everything down, or is there a dynamic change? If there isn't a dynamic change, how to add one?",
				comments: []
			}
		]
	},
	{
		id: 2,
		title: "Thread 2",
		author: "Some Other Person",
		date: Date.now(),
		content: "Comment made by the creator of the thread. Wow, such and such game is great, other people should totally get it",
		comments: [
			{
				id: "1",
				author: "person 2",
				date: Date.now(),
				content: "No, you wrong, other game good, this game bad.",
				comments: [
					{
						id: "2",
						author: "person 3",
						date: Date.now(),
						content: "Yea i completely agree with this guy",
						comments: []
					}
				]
			},
			{
				id: "3",
				author: "person 4",
				date: Date.now(),
				content: "ayeet",
				comments: [
					{
						id: "4",
						author: "person 2",
						date: Date.now(),
						content: "what is wrong with you",
						comments: []
					}
				]
			}
		]
	},
	{
		id: 3,
		title: "Thread 3",
		author: "Person",
		date: Date.now(),
		content: "Comment made by the creator of the thread. Wow, such and such game is great, other people should totally get it",
		comments: [
			{
				id: "1",
				author: "person 2",
				date: Date.now(),
				content: "comment.",
				comments: [
					{
						id: "2",
						author: "person 3",
						date: Date.now(),
						content: "reply",
						comments: []
					},
					{
						id: "4",
						author: "person 5",
						date: Date.now(),
						content: "reply 2",
						comments: []
					}
				]
			},
			{
				id: "3",
				author: "person 4",
				date: Date.now(),
				content: "test.",
				comments: []
			}
		]
	},
	{
		id: 4,
		title: "Thread 4",
		author: "Some New Person",
		date: Date.now(),
		content: "Comment made by the creator of the thread.",
		comments: [
			{
				id: "1",
				author: "person 2",
				date: Date.now(),
				content: "fake comment.",
				comments: []
			},
			{
				id: "2",
				author: "person 3",
				date: Date.now(),
				content: "yeet",
				comments: []
			},
			{
				id: "3",
				author: "person 4",
				date: Date.now(),
				content: "test.",
				comments: []
			},
			{
				id: "4",
				author: "another person",
				date: Date.now(),
				content: "Yea i completely agree with this guy, but what happens when the comment gets too long? Does it just push everything down, or is there a dynamic change? If there isn't a dynamic change, how to add one? Ok now double it: Yea i completely agree with this guy, but what happens when the comment gets too long? Does it just push everything down, or is there a dynamic change? If there isn't a dynamic change, how to add one?",
				comments: []
			}
		]
	}
]

var threads = testThreads
if (localStorage && localStorage.getItem('threads')) {
	threads = JSON.parse(localStorage.getItem('threads'));
} else {
	threads = testThreads;
	localStorage.setItem('threads', JSON.stringify(testThreads));
}
