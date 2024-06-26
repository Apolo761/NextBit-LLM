'use strict';
var __create = Object['create'],
    __defProp = Object['defineProperty'],
    __getOwnPropDesc = Object['getOwnPropertyDescriptor'],
    __getOwnPropNames = Object['getOwnPropertyNames'],
    __getProtoOf = Object['getPrototypeOf'],
    __hasOwnProp = Object['prototype']['hasOwnProperty'],
    __copyProps = (_0x2e782e, _0x28bb86, _0x1be367, _0x409572) => {
        if (_0x28bb86 && typeof _0x28bb86 === 'object' || typeof _0x28bb86 === 'function') {
            for (let _0xc07541 of __getOwnPropNames(_0x28bb86))
                if (!__hasOwnProp['call'](_0x2e782e, _0xc07541) && _0xc07541 !== _0x1be367) __defProp(_0x2e782e, _0xc07541, {
                    'get': () => _0x28bb86[_0xc07541],
                    'enumerable': !(_0x409572 = __getOwnPropDesc(_0x28bb86, _0xc07541)) || _0x409572['enumerable']
                });
        }
        return _0x2e782e;
    },
    __toESM = (_0x3e96ba, _0xf4fd24, _0x493389) => (_0x493389 = _0x3e96ba != null ? __create(__getProtoOf(_0x3e96ba)) : {}, __copyProps(_0xf4fd24 || !_0x3e96ba || !_0x3e96ba['__esModule'] ? __defProp(_0x493389, 'default', {
        'value': _0x3e96ba,
        'enumerable': !![]
    }) : _0x493389, _0x3e96ba)),
    import_wppconnect = __toESM(require('@wppconnect-team/wppconnect'), 0x1),
    import_dotenv3 = __toESM(require('dotenv'), 0x1),
    import_openai = __toESM(require('openai'), 0x1),
    import_dotenv = __toESM(require('dotenv'), 0x1);
import_dotenv['default']['config']();
var assistant, openai, activeChats = new Map();
async function initializeNewAIChatSession(_0x57b642) {
    openai = new import_openai['default']({
        'apiKey': process['env']['OPENAI_KEY']
    }), assistant = await openai['beta']['assistants']['retrieve'](process['env']['OPENAI_ASSISTANT']);
    if (activeChats['has'](_0x57b642)) return;
    const _0xd75e7c = await openai['beta']['threads']['create']();
    activeChats['set'](_0x57b642, _0xd75e7c), setTimeout(() => {
        activeChats['has'](_0x57b642) && (activeChats['delete'](_0x57b642), console['log']('Chat\x20' + _0x57b642 + '\x20expirou\x20e\x20foi\x20removido.'));
    }, Number(process['env']['HORAS_PARA_REATIVAR_IA']) * 0x3c * 0x3c * 0x3e8);
}
async function mainOpenAI({
    currentMessage: _0x33ef76,
    chatId: _0x370743
}) {
    const _0x36ef81 = activeChats['get'](_0x370743);
    await openai['beta']['threads']['messages']['create'](_0x36ef81['id'], {
        'role': 'user',
        'content': _0x33ef76
    });
    const _0x541f7c = await openai['beta']['threads']['runs']['create'](_0x36ef81['id'], {
            'assistant_id': assistant['id'],
            'instructions': assistant['instructions']
        }),
        _0x3ae4ac = await checkRunStatus({
            'threadId': _0x36ef81['id'],
            'runId': _0x541f7c['id']
        }),
        _0x6161ef = _0x3ae4ac['data'][0x0]['content'][0x0];
    return _0x6161ef['text']['value'];
}
async function checkRunStatus({
    threadId: _0x4bbb6c,
    runId: _0x324323
}) {
    return await new Promise((_0x184dcd, _0x30083d) => {
        const _0x2d6e43 = async () => {
            const _0x43030e = await openai['beta']['threads']['runs']['retrieve'](_0x4bbb6c, _0x324323);
            if (_0x43030e['status'] === 'completed') {
                const _0x37f54d = await openai['beta']['threads']['messages']['list'](_0x4bbb6c);
                _0x184dcd(_0x37f54d);
            } else console['log']('Aguardando\x20resposta\x20da\x20OpenAI...'), setTimeout(_0x2d6e43, 0xbb8);
        };
        _0x2d6e43();
    });
}
var allLastMessagesMap = new Map();

function splitMessages(_0x50c473) {
    const _0x1e88b2 = /(http[s]?:\/\/[^\s]+)|(www\.[^\s]+)|([^\s]+@[^\s]+\.[^\s]+)|(["'].*?["'])|(\b\d+\.\s)|(\w+\.\w+)/g,
        _0xf5ae05 = _0x50c473['match'](_0x1e88b2) ?? [],
        _0x31f347 = 'PLACEHOLDER_';
    let _0x2c7a29 = 0x0;
    const _0x2a7ce3 = _0x50c473['replace'](_0x1e88b2, () => '' + _0x31f347 + _0x2c7a29++),
        _0x1e6527 = /(?<!\b\d+\.\s)(?<!\w+\.\w+)[^.?!]+(?:[.?!]+["']?|$)/g;
    let _0x5d4571 = _0x2a7ce3['match'](_0x1e6527) ?? [];
    return _0xf5ae05['length'] > 0x0 && (_0x5d4571 = _0x5d4571['map'](_0x2aec52 => _0xf5ae05['reduce']((_0xb133, _0x24e976, _0x2d36b5) => _0xb133['replace']('' + _0x31f347 + _0x2d36b5, _0x24e976), _0x2aec52))), _0x5d4571;
}
async function delay(_0x226639) {
    return await new Promise(_0xeb60b5 => setTimeout(_0xeb60b5, _0x226639));
}
async function sendMessagesWithDelay({
    messages: _0xc9ca5e,
    client: _0xb16a28,
    targetNumber: _0x483eee,
    activeChatsHistory: _0x1c7be2,
    currentMessage: _0x2980db,
    excludedNumbersIntervention: _0x125924
}) {
    for (const [_0x45f5cc, _0x189c33] of _0xc9ca5e['entries']()) {
        await delay(0x3e8);
        const _0x8027f4 = await _0xb16a28['getMessages'](_0x483eee, {
            'count': 0x5,
            'direction': 'before',
            'fromMe': !![]
        });
        console['log']('lastMessages', _0x8027f4['map'](_0x304f85 => _0x304f85['body']));
        !allLastMessagesMap['has'](_0x483eee) && (console['log']('criando\x20novo\x20map'), allLastMessagesMap['set'](_0x483eee, []));
        let _0x39dd23 = allLastMessagesMap['get'](_0x483eee);
        console['log']({
            'currentLastMessages': _0x39dd23
        });
        const _0x5e681a = _0x8027f4['filter'](_0x398adc => !_0x39dd23['some'](_0xa2b1e4 => _0xa2b1e4['id'] === _0x398adc['id']));
        console['log']({
            'newMessages': _0x5e681a
        }), _0x39dd23 = [..._0x5e681a, ..._0x39dd23]['sort']((_0x2f4b35, _0x4604c5) => _0x2f4b35['timestamp'] - _0x4604c5['timestamp'])['slice'](0x0, 0x32), allLastMessagesMap['set'](_0x483eee, _0x39dd23), console['log']({
            'currentLastMessages': _0x39dd23
        });
        const _0x29102a = await isMissingMessages({
            'activeChatsHistory': _0x1c7be2,
            'chatId': _0x483eee,
            'lastMessages': _0x39dd23
        });
        if (_0x29102a) {
            console['log']('Há\x20mensagens\x20enviadas\x20por\x20humanos\x20na\x20conversa,\x20parando\x20automação...'), _0x125924['set'](_0x483eee, !![]), setTimeout(() => {
                _0x125924['has'](_0x483eee) && _0x125924['delete'](_0x483eee);
            }, Number(process['env']['HORAS_PARA_REATIVAR_IA']) * 0x3c * 0x3c * 0x3e8);
            return;
        }
        await _0xb16a28['startTyping'](_0x483eee);
        const _0x31bfd3 = _0x189c33['length'] * 0x64;
        await new Promise(_0x4f05b3 => setTimeout(_0x4f05b3, _0x31bfd3)), _0xb16a28['sendText'](_0x483eee, _0x189c33['trimStart']()['trimEnd']())['then'](async _0xc416a9 => {
            console['log']('Mensagem\x20enviada:', _0xc416a9['body']);
            if (_0x1c7be2['has'](_0x483eee)) {
                const _0x136c17 = _0x1c7be2['get'](_0x483eee);
                _0x45f5cc === _0xc9ca5e['length'] - 0x1 ? _0x1c7be2['set'](_0x483eee, [..._0x136c17, {
                    'role': 'user',
                    'parts': _0x2980db
                }, {
                    'role': 'model',
                    'parts': _0x189c33['trimStart']()['trimEnd']()
                }]) : _0x1c7be2['set'](_0x483eee, [..._0x136c17, {
                    'role': 'model',
                    'parts': _0x189c33['trimStart']()['trimEnd']()
                }]);
            } else _0x1c7be2['set'](_0x483eee, [{
                'role': 'user',
                'parts': _0x2980db
            }, {
                'role': 'model',
                'parts': _0x189c33['trimStart']()['trimEnd']()
            }]), setTimeout(() => {
                _0x1c7be2['has'](_0x483eee) && (_0x1c7be2['delete'](_0x483eee), console['log']('A\x20IA\x20voltará\x20a\x20responder:\x20' + _0x483eee + '.'));
            }, Number(process['env']['HORAS_PARA_REATIVAR_IA']) * 0x3c * 0x3c * 0x3e8);
            await _0xb16a28['stopTyping'](_0x483eee);
        })['catch'](_0x158782 => {
            console['error']('Erro\x20ao\x20enviar\x20mensagem:', _0x158782);
        });
    }
}

function formatPhoneNumber(_0x4bb549) {
    let _0x53ffe6 = _0x4bb549['replace'](/\D/g, '');
    return _0x53ffe6['length'] === 0xd && _0x53ffe6['startsWith']('55') && (_0x53ffe6 = _0x53ffe6['slice'](0x0, 0x4) + _0x53ffe6['slice'](0x5)), _0x53ffe6 + '@c.us';
}
async function isMissingMessages({
    chatId: _0x1cc74,
    activeChatsHistory: _0x3c7687,
    lastMessages: _0x341bbe
}) {
    const _0x52557d = _0x3c7687['get'](_0x1cc74);
    if (!_0x52557d || _0x52557d['length'] === 0x0) return ![];
    const _0x59ec95 = _0x52557d['filter'](_0x20597d => _0x20597d['role'] === 'model')['shift']();
    console['log']({
        'firstFromMeInHistory': _0x59ec95
    });
    if (!_0x59ec95) return ![];
    const _0x48f475 = _0x341bbe['findLastIndex'](_0x2b7ead => _0x2b7ead['body'] === _0x59ec95['parts'] && _0x2b7ead['fromMe']);
    if (_0x48f475 === -0x1) return ![];
    const _0x5aeb16 = _0x341bbe['slice'](_0x48f475)['filter'](_0x2d3ca2 => _0x2d3ca2['fromMe'])['find'](_0x4fb567 => {
        const _0x2c2b5d = _0x52557d['filter'](_0x329522 => _0x329522['role'] === 'model')['find'](_0x17cfa8 => {
            return _0x17cfa8['parts'] === _0x4fb567['body'];
        });
        if (_0x2c2b5d) return ![];
        return !![];
    });
    return !!_0x5aeb16;
}
var import_generative_ai = require('@google/generative-ai'),
    import_dotenv2 = __toESM(require('dotenv'), 0x1);
import_dotenv2['default']['config']();
var genAI = new import_generative_ai['GoogleGenerativeAI'](process['env']['GEMINI_KEY']),
    model = genAI['getGenerativeModel']({
        'model': 'gemini-pro'
    }),
    activeChats2 = new Map(),
    getOrCreateChatSession = async _0x23f7b3 => {
        if (activeChats2['has'](_0x23f7b3)) {
            const _0xd18cd0 = activeChats2['get'](_0x23f7b3);
            return model['startChat']({
                'history': _0xd18cd0
            });
        }
        const _0x5e86c2 = [{
            'role': 'user',
            'parts': process['env']['GEMINI_PROMPT'] ?? 'oi'
        }, {
            'role': 'model',
            'parts': 'Olá,\x20certo!'
        }];
        return activeChats2['set'](_0x23f7b3, _0x5e86c2), setTimeout(() => {
            activeChats2['has'](_0x23f7b3) && (activeChats2['delete'](_0x23f7b3), console['log']('Chat\x20' + _0x23f7b3 + '\x20expirou\x20e\x20foi\x20removido.'));
        }, Number(process['env']['HORAS_PARA_REATIVAR_IA']) * 0x3c * 0x3c * 0x3e8), model['startChat']({
            'history': _0x5e86c2
        });
    }, mainGoogle = async ({
        currentMessage: _0x5a83c2,
        chatId: _0x4ae6cd
    }) => {
        const _0x314b73 = await getOrCreateChatSession(_0x4ae6cd),
            _0x214f91 = _0x5a83c2,
            _0x3864e1 = await _0x314b73['sendMessage'](_0x214f91),
            _0x4464ba = _0x3864e1['response'];
        console['log']({
            'response': _0x4464ba
        });
        const _0x1d8426 = _0x4464ba['text']();
        return console['log']({
            'text': _0x1d8426
        }), activeChats2['set'](_0x4ae6cd, [...activeChats2['get'](_0x4ae6cd), {
            'role': 'user',
            'parts': _0x214f91
        }, {
            'role': 'model',
            'parts': _0x1d8426
        }]), console['log']('Resposta\x20Gemini:\x20', _0x1d8426), _0x1d8426;
    };
import_dotenv3['default']['config']();
var messageBufferPerChatId = new Map(),
    messageTimeouts = new Map(),
    lastMessageTimestamps = new Map(),
    messageCountPerChatId = new Map(),
    AI_SELECTED = process['env']['AI_SELECTED'] || 'GEMINI',
    MAX_RETRIES = 0x3,
    activeChatsHistory = new Map(),
    allowedNumbers = process['env']['SOMENTE_RESPONDER'] ? process['env']['SOMENTE_RESPONDER']['split'](',') : [],
    excludedNumbers = process['env']['NAO_RESPONDER'] ? process['env']['NAO_RESPONDER']['split'](',') : [],
    allowedNumbersFormatted = allowedNumbers['map'](formatPhoneNumber),
    excludedNumbersFormatted = excludedNumbers['map'](formatPhoneNumber),
    excludedNumbersIntervention = new Map();
if (AI_SELECTED === 'GEMINI' && !process['env']['GEMINI_KEY']) throw Error('Você\x20precisa\x20colocar\x20uma\x20key\x20do\x20Gemini\x20no\x20.env!\x20Crie\x20uma\x20gratuitamente\x20em\x20https://aistudio.google.com/app/apikey?hl=pt-br');
if (AI_SELECTED === 'GPT' && (!process['env']['OPENAI_KEY'] || !process['env']['OPENAI_ASSISTANT'])) throw Error('Para\x20utilizar\x20o\x20GPT\x20você\x20precisa\x20colocar\x20no\x20.env\x20a\x20sua\x20key\x20da\x20openai\x20e\x20o\x20id\x20do\x20seu\x20assistante.');
import_wppconnect['default']['create']({
    'session': 'sessionName',
    'catchQR': (_0x407efc, _0x35626b, _0x45a168, _0x5846cc) => {
        console['log']('Terminal\x20qrcode:\x20', _0x35626b);
    },
    'statusFind': (_0x3a9d9a, _0x4a6706) => {
        console['log']('Status\x20Session:\x20', _0x3a9d9a), console['log']('Session\x20name:\x20', _0x4a6706);
    },
    'headless': 'new'
})['then'](_0x4ab0ec => {
    start(_0x4ab0ec);
})['catch'](_0xa8167a => {
    console['log'](_0xa8167a);
});
async function start(_0x594b1c) {
    _0x594b1c['onMessage'](_0x525568 => {
        ((async () => {
            if (!_0x525568['isGroupMsg'] && _0x525568['chatId'] !== 'status@broadcast') {
                const _0x2bf452 = _0x525568['chatId'];
                if (excludedNumbersIntervention['has'](_0x2bf452)) return;
                if (excludedNumbersFormatted['includes'](_0x2bf452)) {
                    console['log']('Número\x20' + _0x2bf452 + '\x20está\x20na\x20lista\x20de\x20excluídos.\x20Ignorando\x20mensagem.');
                    return;
                }
                if (allowedNumbersFormatted['length'] > 0x0 && !allowedNumbersFormatted['includes'](_0x2bf452)) {
                    console['log']('Número\x20' + _0x2bf452 + '\x20não\x20está\x20na\x20lista\x20de\x20permitidos.\x20Ignorando\x20mensagem.');
                    return;
                }
                const _0x4fb221 = activeChatsHistory['get'](_0x2bf452);
                if (_0x4fb221) {
                    const _0x217899 = await _0x594b1c['getMessages'](_0x2bf452, {
                            'count': 0x14,
                            'direction': 'before',
                            'fromMe': !![]
                        }),
                        _0x295bf6 = await isMissingMessages({
                            'chatId': _0x2bf452,
                            'activeChatsHistory': activeChatsHistory,
                            'lastMessages': _0x217899
                        });
                    if (_0x295bf6) {
                        console['log']('Há\x20mensagens\x20enviadas\x20por\x20humanos\x20na\x20conversa,\x20parando\x20automação\x20para\x20' + _0x2bf452 + '...'), excludedNumbersIntervention['set'](_0x2bf452, !![]), setTimeout(() => {
                            excludedNumbersIntervention['has'](_0x2bf452) && excludedNumbersIntervention['delete'](_0x2bf452);
                        }, Number(process['env']['HORAS_PARA_REATIVAR_IA']) * 0x3c * 0x3c * 0x3e8);
                        return;
                    }
                }
                if (_0x525568['type'] === 'image') {
                    _0x594b1c['sendText'](_0x525568['from'], process['env']['MENSAGEM_PARA_ENVIAR_QUANDO_RECEBER_IMAGEM']);
                    return;
                }
                if (_0x525568['type'] === 'ptt' || _0x525568['type'] === 'audio') {
                    _0x594b1c['sendText'](_0x525568['from'], process['env']['MENSAGEM_PARA_ENVIAR_QUANDO_RECEBER_AUDIO']);
                    return;
                }
                if (_0x525568['type'] === 'document' || _0x525568['type'] === 'location') {
                    _0x594b1c['sendText'](_0x525568['from'], process['env']['MENSAGEM_PARA_ENVIAR_QUANDO_RECEBER_TIPO_DESCONHECIDO']);
                    return;
                }
                if (_0x525568['type'] !== 'chat') return;
                console['log']('Mensagem\x20recebida:', _0x525568['body']);
                const _0x492e0f = Date['now'](),
                    _0x3502f3 = lastMessageTimestamps['get'](_0x2bf452) || _0x492e0f,
                    _0x4a56b1 = messageCountPerChatId['get'](_0x2bf452) || 0x0;
                _0x492e0f - _0x3502f3 > 0xa * 0x3e8 ? (messageCountPerChatId['set'](_0x2bf452, 0x1), lastMessageTimestamps['set'](_0x2bf452, _0x492e0f)) : messageCountPerChatId['set'](_0x2bf452, _0x4a56b1 + 0x1);
                if (messageCountPerChatId['get'](_0x2bf452) > 0x14) {
                    console['log']('Quantidade\x20excessiva\x20de\x20mensagens,\x20ignorando\x20chamada\x20à\x20API\x20de\x20IA.');
                    return;
                }
                AI_SELECTED === 'GPT' && await initializeNewAIChatSession(_0x2bf452), !messageBufferPerChatId['has'](_0x2bf452) ? messageBufferPerChatId['set'](_0x2bf452, [_0x525568['body']]) : messageBufferPerChatId['set'](_0x2bf452, [...messageBufferPerChatId['get'](_0x2bf452), _0x525568['body']]), messageTimeouts['has'](_0x2bf452) && clearTimeout(messageTimeouts['get'](_0x2bf452)), console['log']('Aguardando\x20novas\x20mensagens\x20de\x20' + _0x2bf452 + '...'), messageTimeouts['set'](_0x2bf452, setTimeout(() => {
                    ((async () => {
                        const _0x2371d6 = !messageBufferPerChatId['has'](_0x2bf452) ? _0x525568['body'] : [...messageBufferPerChatId['get'](_0x2bf452)]['join']('\x20\x0a\x20');
                        let _0x56c8bf = '';
                        for (let _0x4eb3fd = 0x1; _0x4eb3fd <= MAX_RETRIES; _0x4eb3fd++) {
                            try {
                                AI_SELECTED === 'GPT' ? _0x56c8bf = await mainOpenAI({
                                    'currentMessage': _0x2371d6,
                                    'chatId': _0x2bf452
                                }) : _0x56c8bf = await mainGoogle({
                                    'currentMessage': _0x2371d6,
                                    'chatId': _0x2bf452
                                });
                                break;
                            } catch (_0x574410) {
                                if (_0x4eb3fd === MAX_RETRIES) throw _0x574410;
                            }
                        }
                        const _0x1752ce = splitMessages(_0x56c8bf);
                        console['log']('Enviando\x20mensagens...'), await sendMessagesWithDelay({
                            'client': _0x594b1c,
                            'messages': _0x1752ce,
                            'targetNumber': _0x525568['from'],
                            'activeChatsHistory': activeChatsHistory,
                            'currentMessage': _0x2371d6,
                            'excludedNumbersIntervention': excludedNumbersIntervention
                        }), messageBufferPerChatId['delete'](_0x2bf452), messageTimeouts['delete'](_0x2bf452);
                    })());
                }, Number(process['env']['SEGUNDOS_PARA_ESPERAR_ANTES_DE_GERAR_RESPOSTA']) * 0x3e8));
            }
        })());
    });
}
