// 题库数据 - 将从JSON文件动态加载
let questionDatabase = {};

// 加载题库数据
function loadQuestions() {
    return fetch('questions.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('题库文件加载失败');
            }
            return response.json();
        })
        .then(data => {
            questionDatabase = data;
            return data;
        })
        .catch(error => {
            console.error('加载题库时出错:', error);
            // 如果加载失败，使用默认题目
            questionDatabase = {
                "001": {
                    "question": "旺旺是什么的叫声",
                    "answer": "A",
                    "optionA": "狗",
                    "optionB": "猫",
                    "optionC": "乌龟"
                },
                "002": {
                    "question": "喵喵是什么的叫声",
                    "answer": "B",
                    "optionA": "狗",
                    "optionB": "猫",
                    "optionC": "乌龟"
                },
                "003": {
                    "question": "呜呜是什么的叫声",
                    "answer": "C",
                    "optionA": "狗",
                    "optionB": "猫",
                    "optionC": "乌龟"
                }
            };
            return questionDatabase;
        });
}

// 页面加载时立即加载题库
document.addEventListener('DOMContentLoaded', function() {
    loadQuestions().then(() => {
        console.log('题库加载完成');
        // 显示所有可用的题目序号
        const questionNumbers = Object.keys(questionDatabase);
        if (questionNumbers.length > 0) {
            console.log('可用题目序号:', questionNumbers.join(', '));
        }
    });
});

// 获取题目函数
function getQuestion(questionNumber) {
    return questionDatabase[questionNumber] || null;
}

// 检查答案是否正确
function checkAnswer(questionNumber, userAnswer) {
    const question = getQuestion(questionNumber);
    if (!question) return false;
    return question.answer === userAnswer;
}

// 获取DOM元素
const questionNumberSection = document.getElementById('question-number-section');
const questionSection = document.getElementById('question-section');
const resultSection = document.getElementById('result-section');
const questionNumberInput = document.getElementById('question-number-input');
const confirmNumberBtn = document.getElementById('confirm-number-btn');
const submitAnswerBtn = document.getElementById('submit-answer-btn');
const backBtn = document.getElementById('back-btn');
const nextQuestionBtn = document.getElementById('next-question-btn');
const questionTitle = document.getElementById('question-title');
const optionA = document.getElementById('option-a');
const optionB = document.getElementById('option-b');
const optionC = document.getElementById('option-c');
const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');
const resultBox = document.getElementById('result-box');

// 当前题目的序号
let currentQuestionNumber = null;

// 事件监听器：确认题目序号
confirmNumberBtn.addEventListener('click', function() {
    const inputNumber = questionNumberInput.value.trim();
    
    // 验证输入
    if (!inputNumber) {
        alert('请输入题目序号');
        return;
    }
    
    // 获取题目
    const question = getQuestion(inputNumber);
    
    if (!question) {
        alert('未找到该题目，请检查序号是否正确');
        return;
    }
    
    // 保存当前题目序号
    currentQuestionNumber = inputNumber;
    
    // 显示题目
    questionTitle.textContent = question.question;
    optionA.textContent = question.optionA;
    optionB.textContent = question.optionB;
    optionC.textContent = question.optionC;
    
    // 清空之前的选择
    const radioButtons = document.querySelectorAll('input[name="answer"]');
    radioButtons.forEach(radio => {
        radio.checked = false;
    });
    
    // 隐藏序号输入区域，显示题目区域
    questionNumberSection.style.display = 'none';
    questionSection.style.display = 'block';
});

// 事件监听器：提交答案
submitAnswerBtn.addEventListener('click', function() {
    // 获取用户选择的答案
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    
    if (!selectedAnswer) {
        alert('请选择一个答案');
        return;
    }
    
    // 检查答案是否正确
    const isCorrect = checkAnswer(currentQuestionNumber, selectedAnswer.value);
    const question = getQuestion(currentQuestionNumber);
    
    // 显示结果
    if (isCorrect) {
        resultTitle.textContent = '恭喜，回答正确！';
        resultMessage.textContent = `正确答案是：${selectedAnswer.value}. ${getOptionText(selectedAnswer.value, question)}`;
        resultBox.className = 'result-box result-correct';
    } else {
        resultTitle.textContent = '很遗憾，回答错误！';
        resultMessage.textContent = `正确答案是：${question.answer}. ${getOptionText(question.answer, question)}`;
        resultBox.className = 'result-box result-incorrect';
    }
    
    // 隐藏题目区域，显示结果区域
    questionSection.style.display = 'none';
    resultSection.style.display = 'block';
});

// 辅助函数：获取选项文本
function getOptionText(option, question) {
    switch(option) {
        case 'A': return question.optionA;
        case 'B': return question.optionB;
        case 'C': return question.optionC;
        default: return '';
    }
}

// 事件监听器：返回
backBtn.addEventListener('click', function() {
    questionSection.style.display = 'none';
    questionNumberSection.style.display = 'block';
    questionNumberInput.value = '';
    currentQuestionNumber = null;
});

// 事件监听器：下一题
nextQuestionBtn.addEventListener('click', function() {
    resultSection.style.display = 'none';
    questionNumberSection.style.display = 'block';
    questionNumberInput.value = '';
    currentQuestionNumber = null;
});

// 回车键提交
questionNumberInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        confirmNumberBtn.click();
    }
});