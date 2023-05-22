const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

function handleLessonSchedule(bot, msg) {
    const messageText = msg.text;

    pinLessonsMessage(bot, msg);
    const formatedData = formatDataToSend(messageText);
    if (formatedData === "fuck") return;
    sendDataToDB(formatedData);
}

function pinLessonsMessage(bot, msg) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    msg.chat.type === "supergroup" && bot.pinChatMessage(chatId, messageId, { disable_notification: true });
}

function formatDataToSend(text) {
    try {
    const data = {
        lessons: []
    };

    const lines = text.split("\n");
    data["dayTitle"] = lines[0];

    const lessons = lines.slice(1);

    const splitedLessons = [];
    lessons.forEach((lesson) => {
        splitedLessons.push(lesson.split(" - "));
    });

    splitedLessons.forEach((lesson) => {
        const timeData = lesson[0].split(":");

        const firstLetter = lesson[1].slice(0, 1).toUpperCase();
        const restName = lesson[1].slice(1);
        const title = `${firstLetter}${restName}`;

        const newLesson = {
            time: {
                hour: timeData[0],
                minute: timeData[1]
            },
            didEnd: false,
            title: title,
            link: null
        };

        data["lessons"].push(newLesson);
    });

    // const lastLessonTime = {
    //     hour: data['lessons'][data.lessons.length - 1]['time']['hour'],
    //     minute: data['lessons'][data.lessons.length - 1]['time']['minute']
    // }

    // console.log(lastLessonTime);

    return data;
    } catch(error) {
       console.log(error);
        return "fuck";
    }
}

async function sendDataToDB(data) {
    await fetch('https://mediator-topaz.vercel.app/api/lessons', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

async function addLinksToSchedule(bot, msg) {
    const chatId = msg.chat.id;
    const text = msg.text;

    const links = await getAllLinks(text);
    await setNewLinks(links);
    await bot.sendMessage(chatId, "Ссылки на уроки были добавлены!");
}

function getAllLinks(text) {
    const lines = text.split("\n");
    const lessons = lines.slice(1);

    const splitedLinks = [];
    lessons.forEach((lesson) => {
        splitedLinks.push(lesson.split(" - "));
    });

    return splitedLinks;
}

async function setNewLinks(data) {
    await fetch("https://mediator-topaz.vercel.app/api/lessons/addLinks", {
        method: "POST",
        body: JSON.stringify({ lessonLinks: data }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

module.exports = { handleLessonSchedule, addLinksToSchedule };
