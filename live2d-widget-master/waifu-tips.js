/*
 * https://imjad.cn/archives/lab/add-dynamic-poster-girl-with-live2d-to-your-blog-02
 * https://www.fghrsh.net/post/123.html
 */

function loadWidget(waifuPath, apiPath) {
	localStorage.removeItem("waifu-display");
	sessionStorage.removeItem("waifu-text");
	document.body.insertAdjacentHTML('beforeend', `<div id="waifu">
			<div id="waifu-tips"></div>
			<canvas id="live2d" width="300" height="300"></canvas>
			<div id="waifu-tool">
				<span class="fa fa-lg fa-comment"></span>
				<span class="fa fa-lg fa-paper-plane"></span>
				<span class="fa fa-lg fa-user-circle"></span>
				<span class="fa fa-lg fa-street-view"></span>
				<span class="fa fa-lg fa-camera-retro"></span>
				<span class="fa fa-lg fa-info-circle"></span>
				<span class="fa fa-lg fa-times"></span>
			</div>
		</div>`);
	$("#waifu").show().animate({ bottom: 0 }, 3000);

	function registerEventListener() {
		document.querySelector("#waifu-tool .fa-comment").addEventListener("click", showHitokoto);
		document.querySelector("#waifu-tool .fa-paper-plane").addEventListener("click", () =&gt; {
			if (window.Asteroids) {
				if (!window.ASTEROIDSPLAYERS) window.ASTEROIDSPLAYERS = [];
				window.ASTEROIDSPLAYERS.push(new Asteroids());
			} else {
				$.ajax({
					url: "https://cdn.jsdelivr.net/gh/GalaxyMimi/CDN/asteroids.js",
					dataType: "script",
					cache: true
				});
			}
		});
		document.querySelector("#waifu-tool .fa-user-circle").addEventListener("click", loadOtherModel);
		document.querySelector("#waifu-tool .fa-street-view").addEventListener("click", loadRandModel);
		document.querySelector("#waifu-tool .fa-camera-retro").addEventListener("click", () =&gt; {
			showMessage("照好了嘛，是不是很可爱呢？", 6000, 9);
			Live2D.captureName = "photo.png";
			Live2D.captureFrame = true;
		});
		document.querySelector("#waifu-tool .fa-info-circle").addEventListener("click", () =&gt; {
			open("https://github.com/stevenjoezhang/live2d-widget");
		});
		document.querySelector("#waifu-tool .fa-times").addEventListener("click", () =&gt; {
			localStorage.setItem("waifu-display", Date.now());
			showMessage("愿你有一天能与重要的人重逢。", 2000, 11);
			$("#waifu").animate({ bottom: -500 }, 3000, () =&gt; {
				$("#waifu").hide();
				$("#waifu-toggle").show().animate({ "margin-left": -50 }, 1000);
			});
		});
		var re = /x/;
		console.log(re);
		re.toString = () =&gt; {
			showMessage("哈哈，你打开了控制台，是想要看看我的小秘密吗？", 6000, 9);
			return "";
		};
		window.addEventListener("copy", () =&gt; {
			showMessage("你都复制了些什么呀，转载要记得加上出处哦！", 6000, 9);
		});
		window.addEventListener("visibilitychange", () =&gt; {
			if (!document.hidden) showMessage("哇，你终于回来了～", 6000, 9);
		});
	}
	registerEventListener();

	function welcomeMessage() {
		var SiteIndexUrl = `${location.protocol}//${location.host}/`, text; //自动获取主页
		if (location.href == SiteIndexUrl) { //如果是主页
			var now = new Date().getHours();
			if (now &gt; 5 &amp;&amp; now &lt;= 7) text = "早上好！一日之计在于晨，美好的一天就要开始了。";
			else if (now &gt; 7 &amp;&amp; now &lt;= 11) text = "上午好！工作顺利嘛，不要久坐，多起来走动走动哦！";
			else if (now &gt; 11 &amp;&amp; now &lt;= 14) text = "中午了，工作了一个上午，现在是午餐时间！";
			else if (now &gt; 14 &amp;&amp; now &lt;= 17) text = "午后很容易犯困呢，今天的运动目标完成了吗？";
			else if (now &gt; 17 &amp;&amp; now &lt;= 19) text = "傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红～";
			else if (now &gt; 19 &amp;&amp; now &lt;= 21) text = "晚上好，今天过得怎么样？";
			else if (now &gt; 21 &amp;&amp; now &lt;= 23) text = ["已经这么晚了呀，早点休息吧，晚安～", "深夜时要爱护眼睛呀！"];
			else text = "你是夜猫子呀？这么晚还不睡觉，明天起的来嘛？";
		} else if (document.referrer !== "") {
			var referrer = document.createElement("a");
			referrer.href = document.referrer;
			var domain = referrer.hostname.split(".")[1];
			if (location.hostname == referrer.hostname) text = `欢迎阅读<span style="color:#0099cc;">『${document.title.split(" - ")[0]}』</span>`;
			else if (domain == "baidu") text = `Hello！来自 百度搜索 的朋友<br>你是搜索 <span style="color:#0099cc;">${referrer.search.split("&amp;wd=")[1].split("&amp;")[0]}</span> 找到的我吗？`;
			else if (domain == "so") text = `Hello！来自 360搜索 的朋友<br>你是搜索 <span style="color:#0099cc;">${referrer.search.split("&amp;q=")[1].split("&amp;")[0]}</span> 找到的我吗？`;
			else if (domain == "google") text = `Hello！来自 谷歌搜索 的朋友<br>欢迎阅读<span style="color:#0099cc;">『${document.title.split(" - ")[0]}』</span>`;
			else text = `Hello！来自 <span style="color:#0099cc;">${referrer.hostname}</span> 的朋友`;
		} else {
			text = `欢迎阅读<span style="color:#0099cc;">『${document.title.split(" - ")[0]}』</span>`;
		}
		showMessage(text, 7000, 8);
	}
	welcomeMessage();
	//检测用户活动状态，并在空闲时定时显示一言
	var userAction = false,
		hitokotoTimer = null,
		messageTimer = null,
		messageArray = ["好久不见，日子过得好快呢……", "大坏蛋！你都多久没理人家了呀，嘤嘤嘤～", "嗨～快来逗我玩吧！", "拿小拳拳锤你胸口！"];
	if ($(".fa-share-alt").is(":hidden")) messageArray.push("记得把小家加入 Adblock 白名单哦！");
	$(document).mousemove(() =&gt; {
		userAction = true;
	}).keydown(() =&gt; {
		userAction = true;
	});
	setInterval(() =&gt; {
		if (!userAction) {
			if (!hitokotoTimer) hitokotoTimer = setInterval(showHitokoto, 25000);
		} else {
			userAction = false;
			clearInterval(hitokotoTimer);
			hitokotoTimer = null;
		}
	}, 1000);

	function showHitokoto() {
		//增加 hitokoto.cn 的 API
		if (Math.random() &lt; 0.6 &amp;&amp; messageArray.length &gt; 0) showMessage(messageArray[Math.floor(Math.random() * messageArray.length)], 6000, 9);
		else fetch("https://v1.hitokoto.cn")
			.then(response =&gt; response.json())
			.then(result =&gt; {
				var text = `这句一言来自 <span style="color:#0099cc;">『${result.from}』</span>，是 <span style="color:#0099cc;">${result.creator}</span> 在 hitokoto.cn 投稿的。`;
				showMessage(result.hitokoto, 6000, 9);
				setTimeout(() =&gt; {
					showMessage(text, 4000, 9);
				}, 6000);
			});
	}

	function showMessage(text, timeout, priority) {
		if (!text) return;
		if (!sessionStorage.getItem("waifu-text") || sessionStorage.getItem("waifu-text") &lt;= priority) {
			if (messageTimer) {
				clearTimeout(messageTimer);
				messageTimer = null;
			}
			if (Array.isArray(text)) text = text[Math.floor(Math.random() * text.length)];
			sessionStorage.setItem("waifu-text", priority);
			$("#waifu-tips").stop().html(text).fadeTo(200, 1);
			messageTimer = setTimeout(() =&gt; {
				sessionStorage.removeItem("waifu-text");
				$("#waifu-tips").fadeTo(1000, 0);
			}, timeout);
		}
	}

	function initModel() {
		var modelId = localStorage.getItem("modelId"),
			modelTexturesId = localStorage.getItem("modelTexturesId");
		if (modelId == null) {
			//首次访问加载 指定模型 的 指定材质
			var modelId = 1, //模型 ID
				modelTexturesId = 53; //材质 ID
		}
		loadModel(modelId, modelTexturesId);
		fetch(waifuPath)
			.then(response =&gt; response.json())
			.then(result =&gt; {
				result.mouseover.forEach(tips =&gt; {
					window.addEventListener("mouseover", event =&gt; {
						if (!event.target.matches(tips.selector)) return;
						var text = Array.isArray(tips.text) ? tips.text[Math.floor(Math.random() * tips.text.length)] : tips.text;
						text = text.replace("{text}", event.target.innerText);
						showMessage(text, 4000, 8);
					});
				});
				result.click.forEach(tips =&gt; {
					window.addEventListener("click", event =&gt; {
						if (!event.target.matches(tips.selector)) return;
						var text = Array.isArray(tips.text) ? tips.text[Math.floor(Math.random() * tips.text.length)] : tips.text;
						text = text.replace("{text}", event.target.innerText);
						showMessage(text, 4000, 8);
					});
				});
				result.seasons.forEach(tips =&gt; {
					var now = new Date(),
						after = tips.date.split("-")[0],
						before = tips.date.split("-")[1] || after;
					if ((after.split("/")[0] &lt;= now.getMonth() + 1 &amp;&amp; now.getMonth() + 1 &lt;= before.split("/")[0]) &amp;&amp; (after.split("/")[1] &lt;= now.getDate() &amp;&amp; now.getDate() &lt;= before.split("/")[1])) {
						var text = Array.isArray(tips.text) ? tips.text[Math.floor(Math.random() * tips.text.length)] : tips.text;
						text = text.replace("{year}", now.getFullYear());
						//showMessage(text, 7000, true);
						messageArray.push(text);
					}
				});
			});
	}
	initModel();

	function loadModel(modelId, modelTexturesId) {
		localStorage.setItem("modelId", modelId);
		if (modelTexturesId === undefined) modelTexturesId = 0;
		localStorage.setItem("modelTexturesId", modelTexturesId);
		loadlive2d("live2d", `${apiPath}/get/?id=${modelId}-${modelTexturesId}`, console.log(`Live2D 模型 ${modelId}-${modelTexturesId} 加载完成`));
	}

	function loadRandModel() {
		var modelId = localStorage.getItem("modelId"),
			modelTexturesId = localStorage.getItem("modelTexturesId");
		//可选 "rand"(随机), "switch"(顺序)
		fetch(`${apiPath}/rand_textures/?id=${modelId}-${modelTexturesId}`)
			.then(response =&gt; response.json())
			.then(result =&gt; {
				if (result.textures["id"] == 1 &amp;&amp; (modelTexturesId == 1 || modelTexturesId == 0)) showMessage("我还没有其他衣服呢！", 4000, 10);
				else showMessage("我的新衣服好看嘛？", 4000, 10);
				loadModel(modelId, result.textures["id"]);
			});
	}

	function loadOtherModel() {
		var modelId = localStorage.getItem("modelId");
		fetch(`${apiPath}/switch/?id=${modelId}`)
			.then(response =&gt; response.json())
			.then(result =&gt; {
				loadModel(result.model["id"]);
				showMessage(result.model["message"], 4000, 10);
			});
	}
}

function initWidget(waifuPath = "/waifu-tips.json", apiPath = "") {
	if (screen.width &lt;= 768) return;
	document.body.insertAdjacentHTML('beforeend', `<div id="waifu-toggle" style="margin-left: -100px;">
			<span>看板娘</span>
		</div>`);
	$("#waifu-toggle").hover(() =&gt; {
		$("#waifu-toggle").animate({ "margin-left": -30 }, 500);
	}, () =&gt; {
		$("#waifu-toggle").animate({ "margin-left": -50 }, 500);
	}).click(() =&gt; {
		$("#waifu-toggle").animate({ "margin-left": -100 }, 1000, () =&gt; {
			$("#waifu-toggle").hide();
		});
		if ($("#waifu-toggle").attr("first-time")) {
			loadWidget(waifuPath, apiPath);
			$("#waifu-toggle").attr("first-time", false);
		} else {
			localStorage.removeItem("waifu-display");
			$("#waifu").show().animate({ bottom: 0 }, 3000);
		}
	});
	if (localStorage.getItem("waifu-display") &amp;&amp; Date.now() - localStorage.getItem("waifu-display") &lt;= 86400000) {
		$("#waifu-toggle").attr("first-time", true).css({ "margin-left": -50 });
	} else {
		loadWidget(waifuPath, apiPath);
	}
}
