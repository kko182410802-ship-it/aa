import { SceneInfo, FloatingComment } from '../types/film';

export const TOTAL_DURATION = 60; // 60 seconds

export const FILM_SCENES: SceneInfo[] = [
  {
    id: 1,
    numberStr: 'Scene 01',
    title: '상처가 되는 한마디',
    subtitle: 'The Hurtful Word',
    startTime: 0,
    endTime: 7,
    image: '/src/assets/images/scene1_hurtful_comment_1791764546813.jpg',
    tone: '차가운 푸른빛 · 적막과 고립감',
    cameraMovement: '스마트폰 화면을 향해 서서히 들어가는 느린 슬로우 줌인 (Slow Push-in)',
    lightingDescription: '스마트폰의 차가운 6500K 블루 라이트가 얼굴 윤곽만을 서늘하게 밝힘',
    soundCue: '미세한 앰비언트 험(Hum) 사운드, 조용한 알림음, 단조의 단선율 피아노',
    mainDialogue: '넌 아무도 필요로 하지 않는 사람이야.',
    narrativeText: '어두운 방 안, 스마트폰 화면의 푸른빛이 차갑게 얼굴을 비춘다. SNS 알림과 함께 상처가 되는 첫 댓글이 떠오른다.',
    directorNotes: '과장된 슬픔보다는 혼자 남겨진 방 안의 공허함과 차가운 디지털 불빛의 대조를 강조한다. 인물의 눈동자에 비친 액정의 반사가 시린 느낌을 전달해야 한다.'
  },
  {
    id: 2,
    numberStr: 'Scene 02',
    title: '점점 쌓이는 말들',
    subtitle: 'Accumulating Words',
    startTime: 7,
    endTime: 17,
    image: '/src/assets/images/scene2_glitch_comments_1791764559866.jpg',
    tone: '압박감 · 불안 · 디지털 왜곡',
    cameraMovement: '약한 핸드헬드 떨림과 빠른 컷 전환, 미세한 글리치 효과',
    lightingDescription: '댓글이 폭주함에 따라 불규칙하게 명멸하는 액정 플리커(Flicker) 조명',
    soundCue: '빗발치는 알림음 중첩, 거칠어지는 심장 박동음, 왜곡된 노이즈',
    mainDialogue: '너는 이상해. / 아무도 널 좋아하지 않아. / 차라리 아무 말도 하지 마.',
    narrativeText: '부정적인 댓글들이 끝없이 밀려들어 화면을 짓누른다. 인물은 숨이 막히는 압박감 속에 결국 스마트폰을 내려놓는다.',
    directorNotes: '시각적/청각적으로 감각적 포화를 유발하여 관객에게도 사이버 언어폭력의 무게와 질식감을 직접 체험하게 한다.'
  },
  {
    id: 3,
    numberStr: 'Scene 03',
    title: '화면 너머의 사람',
    subtitle: 'The Person Beyond the Screen',
    startTime: 17,
    endTime: 27,
    image: '/src/assets/images/scene3_lonely_window_1791764571589.jpg',
    tone: '적막 · 상처의 깊이 · 쓸쓸함',
    cameraMovement: '창가에 홀로 웅크린 인물을 향해 천천히 다가가는 정적인 돌리인 (Slow Dolly-in)',
    lightingDescription: '비 내리는 창밖의 어둠과 바닥에 떨어진 폰의 희미한 잔광만이 남음',
    soundCue: '배경음악이 서서히 잦아들며 25초 무렵 완전히 멈추는 페이드아웃',
    mainDialogue: '누군가에게는 가벼운 댓글이지만,\n누군가에게는 오래 남는 상처가 됩니다.',
    narrativeText: '창가에 혼자 웅크린 채 고개를 떨군 인물. 화면 밖으로 던져진 무심한 말들이 한 인간의 영혼에 새겨진 상처로 남는다.',
    directorNotes: '소리가 완전히 소멸되는 침묵의 구간을 통해, 가벼운 손가락 움직임 하나가 실제 살아 숨쉬는 사람에게 어떤 고통을 안기는지 깊이 응시하게 한다.'
  },
  {
    id: 4,
    numberStr: 'Scene 04',
    title: '잠깐의 침묵',
    subtitle: 'A Moment of Silence',
    startTime: 27,
    endTime: 37,
    image: '/src/assets/images/scene4_light_in_dark_1791764581279.jpg',
    tone: '절대적 암전 · 성찰과 전환의 여백',
    cameraMovement: '깊은 어둠 속 정중앙에서 서서히 퍼져나가는 따뜻한 빛의 번짐',
    lightingDescription: '완전한 블랙아웃에서 시작되어 작은 온기를 품은 황금빛 불씨로의 미세한 점등',
    soundCue: '완전한 무음(무향) 상태 지속 후, 32초경 은은한 크리스탈 배음이 조용히 번짐',
    mainDialogue: '화면 너머에도 사람이 있습니다.',
    narrativeText: '화면이 천천히 검은색으로 물든다. 아무런 소리도 들리지 않는 깊은 침묵. 그리고 어둠 속에서 아주 작은 따스한 빛 하나가 피어오른다.',
    directorNotes: '사이버 공간에서 잊기 쉬운 가장 본질적인 진실을 환기하는 핵심 전곡점이다. 텍스트의 크기와 등장 속도를 매우 정제되게 절제한다.'
  },
  {
    id: 5,
    numberStr: 'Scene 05',
    title: '우리가 선택할 수 있는 것',
    subtitle: 'What We Can Choose',
    startTime: 37,
    endTime: 50,
    image: '/src/assets/images/scene5_warm_morning_1791764592980.jpg',
    tone: '따뜻한 햇살 · 치유와 희망 · 온기',
    cameraMovement: '창밖 맑은 하늘에서 인물의 얼굴로 유려하게 흐르는 슬로우 패닝',
    lightingDescription: '차가운 블루에서 3200K 따스한 아침 햇살(골든 아워) 베이지·금빛 톤으로의 극적인 반전',
    soundCue: '가슴을 울리는 따뜻하고 서정적인 어쿠스틱 피아노 멜로디의 부드러운 재개와 스트링 앙상블',
    mainDialogue: '우리의 말은 누군가를 살리는 온기가 될 수도 있습니다.',
    narrativeText: '창가로 쏟아지는 눈부신 아침 햇살. 인물은 조심스레 고개를 들고 창밖의 맑은 하늘을 바라보며 엷은 미소를 짓는다.',
    directorNotes: '색감의 온도가 블루에서 앰버 골드로 완전히 반전되며 보는 이의 마음에 정화와 위로를 건넨다. 연기는 과장 없이 담담한 안도감을 표현한다.'
  },
  {
    id: 6,
    numberStr: 'Scene 06',
    title: '에필로그 / 마지막 장면',
    subtitle: 'Words Remain',
    startTime: 50,
    endTime: 60,
    image: '', // Pure cinematic black background
    tone: '깊은 여운 · 세련된 타이포그래피 · 결의',
    cameraMovement: '정적인 블랙 프레임 속 은은한 텍스트 페이드인 & 페이드아웃',
    lightingDescription: '칠흑 같은 어둠 속에 떠오르는 순백의 서체',
    soundCue: '깊은 피아노의 마지막 저음 화음 잔향과 맑은 벨 소리가 허공으로 길게 페이드아웃',
    mainDialogue: '말은 남는다.',
    narrativeText: '검은 배경 위에 선명하게 새겨지는 제목과 슬로건. 우리가 남겨야 할 말의 가치를 마음에 아로새긴다.',
    directorNotes: '「말은 남는다.」 그리고 「상처 대신 따뜻함을 남기세요.」 문구가 차례로 정돈되어 나타난 후 서서히 암전되며 깊은 침묵 속에서 영상이 마무리된다.'
  }
];

export const SCENE_COMMENTS: FloatingComment[] = [
  {
    id: 'c1',
    text: '넌 아무도 필요로 하지 않는 사람이야.',
    author: 'user_9841',
    handle: '@dark_anon',
    timeAppear: 2.2,
    position: { top: '38%', left: '16%' },
    severity: 'critical'
  },
  {
    id: 'c2',
    text: '너는 이상해.',
    author: '익명_204',
    handle: '@ghost_v',
    timeAppear: 7.8,
    position: { top: '22%', right: '15%' },
    severity: 'high'
  },
  {
    id: 'c3',
    text: '아무도 널 좋아하지 않아.',
    author: 'cloud_shade',
    handle: '@c_shade',
    timeAppear: 9.4,
    position: { top: '48%', left: '20%' },
    severity: 'critical'
  },
  {
    id: 'c4',
    text: '차라리 아무 말도 하지 마.',
    author: 'random_09',
    handle: '@no_voice',
    timeAppear: 11.2,
    position: { bottom: '34%', right: '22%' },
    severity: 'high'
  },
  {
    id: 'c5',
    text: '왜 사냐 진짜',
    author: '익명댓글러',
    handle: '@hater_99',
    timeAppear: 13.0,
    position: { top: '32%', left: '38%' },
    severity: 'high'
  },
  {
    id: 'c6',
    text: '댓글 읽고 상처받았겠네 ㅋㅋㅋ',
    author: 'user_kxx',
    handle: '@kxx_null',
    timeAppear: 14.5,
    position: { bottom: '22%', left: '28%' },
    severity: 'high'
  }
];

export const CONTEST_METADATA = {
  title: '말은 남는다',
  englishTitle: 'Words Remain',
  category: '디지털 미디어 공모전 / 공익 영상 부문',
  format: '16:9 가로형 (1920 × 1080 Full HD)',
  duration: '60초 (Short Film)',
  frameRate: '60 fps',
  colorSpace: 'Rec.709 / Cinematic DCI-P3 Emulation',
  synopsis: `어두운 방 안, 스마트폰의 푸른빛 속에 쏟아지는 악성 댓글에 상처받은 청년의 고립된 밤.
말들은 사라지지 않고 날카로운 비수가 되어 한 인간의 마음에 고스란히 쌓여간다.
그러나 적막과 침묵 속에서 비로소 깨닫게 되는 진실—
"화면 너머에도 사람이 있습니다."
차가운 액정의 파란빛을 뚫고 찾아온 아침 햇살과 함께, 우리는 상처 대신 온기를 남기기로 선택한다.`,
  directorsStatement: `우리는 너무 쉽게 손가락 끝으로 글자를 적고 전송을 누릅니다. 상대방의 표정이나 눈물을 볼 수 없기에, 비대면의 스크린은 때로 잔혹한 폭력의 방패가 되곤 합니다.
본 단편 영상 「말은 남는다」는 바로 그 '무심함'이 만들어내는 상처의 무게를 묵직하게 조명하고, 침묵을 거쳐 햇살로 전환되는 색온도의 변화를 통해 언어의 치유적 가능성을 전하고자 기획되었습니다.`,
  credits: [
    { role: '기획 및 연출', name: 'Digital Media Production Lab' },
    { role: '촬영 및 조명', name: 'Cinematic Visual Arts' },
    { role: '사운드 디자인 & 음악', name: 'Acoustic Sound Lab' },
    { role: '색보정 (Color Grading)', name: 'Nordic Teal to Amber Gold' }
  ]
};
