export const translations = {
  uz: {
    // Navigation & Sidebar
    dashboard: "Asosiy",
    tasks: "Vazifalar",
    calendar: "Kalendar",
    categories: "Kategoriyalar",
    settings: "Sozlamalar",
    signOut: "Chiqish",

    // Dashboard
    welcomeBack: "Xush kelibsiz",
    statsOverview: "Statistika va umumiy holat",
    totalTasks: "Jami vazifalar",
    completedTasks: "Bajarilganlar",
    pendingTasks: "Kutilmoqda",
    activeCategories: "Kategoriyalar",
    recentActivity: "Oxirgi harakatlar",
    noTasksToday: "Bugun hech qanday vazifa yo'q. Dam oling! ✨",

    // Tasks Page
    allTasks: "Barcha vazifalar",
    searchTasks: "Vazifalarni qidirish...",
    addTask: "Yangi vazifa",
    priority: "Muhimlik",
    high: "Yuqori",
    medium: "O'rta",
    low: "Past",
    status: "Holati",
    pending: "Kutilmoqda",
    in_progress: "Jarayonda",
    completed: "Bajarildi",
    cancelled: "Bekor qilindi",
    noTasksFound: "Vazifalar topilmadi",

    // Calendar
    weekDays: ["Dush", "Sesh", "Chor", "Pay", "Jum", "Shan", "Yak"],
    months: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"],

    // Settings
    profileSettings: "Profil va ilova sozlamalari",
    personalInfo: "Shaxsiy ma'lumotlar",
    fullName: "To'liq ism",
    email: "Elektron pochta",
    languageRegion: "Til va mintaqa",
    appLanguage: "Ilova tili",
    timezone: "Mintaqa vaqti",
    auto: "Avto",
    timezoneDesc: "Vaqt mintaqasi qurilmangiz sozlamalariga qarab avtomatik belgilanadi.",
    appInfo: "Ilova haqida",
    version: "Versiya",
    backend: "Backend",
    mobileApp: "Mobil ilova",
    created: "Yaratildi",

    // Categories
    allCategories: "Barcha kategoriyalar",
    newCategory: "Yangi kategoriya",
    noCategories: "Kategoriyalar hali mavjud emas",

    // Auth
    loginTitle: "Xush kelibsiz",
    loginDesc: "OnTime ilovasiga o'z hisobingiz orqali kiring",
    signInWithGoogle: "Google orqali kirish",
    or: "yoki",
    noAccount: "Hisobingiz yo'qmi?",
    signUp: "Ro'yxatdan o'tish",
    alreadyHaveAccount: "Hisobingiz bormi?",
    registerTitle: "Hisob ochish",
    registerDesc: "Vaqtingizni unumli boshqarishni boshlang",
  },
  ru: {
    // Navigation & Sidebar
    dashboard: "Главная",
    tasks: "Задачи",
    calendar: "Календарь",
    categories: "Категории",
    settings: "Настройки",
    signOut: "Выйти",

    // Dashboard
    welcomeBack: "С возвращением",
    statsOverview: "Статистика и общее состояние",
    totalTasks: "Всего задач",
    completedTasks: "Завершено",
    pendingTasks: "В ожидании",
    activeCategories: "Категории",
    recentActivity: "Последние действия",
    noTasksToday: "На сегодня задач нет. Отдыхайте! ✨",

    // Tasks Page
    allTasks: "Все задачи",
    searchTasks: "Поиск задач...",
    addTask: "Новая задача",
    priority: "Приоритет",
    high: "Высокий",
    medium: "Средний",
    low: "Низкий",
    status: "Статус",
    pending: "Ожидание",
    in_progress: "В процессе",
    completed: "Завершено",
    cancelled: "Отменено",
    noTasksFound: "Задачи не найдены",

    // Calendar
    weekDays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],

    // Settings
    profileSettings: "Настройки профиля и приложения",
    personalInfo: "Личные данные",
    fullName: "Полное имя",
    email: "Электронная почта",
    languageRegion: "Язык и регион",
    appLanguage: "Язык приложения",
    timezone: "Часовой пояс",
    auto: "Авто",
    timezoneDesc: "Часовой пояс устанавливается автоматически в зависимости от настроек вашего устройства.",
    appInfo: "О приложении",
    version: "Версия",
    backend: "Бэкенд",
    mobileApp: "Мобильное приложение",
    created: "Создано",

    // Categories
    allCategories: "Все категории",
    newCategory: "Новая категория",
    noCategories: "Категории еще не созданы",

    // Auth
    loginTitle: "С возвращением",
    loginDesc: "Войдите в OnTime через свой аккаунт",
    signInWithGoogle: "Войти через Google",
    or: "или",
    noAccount: "Нет аккаунта?",
    signUp: "Регистрация",
    alreadyHaveAccount: "Уже есть аккаунт?",
    registerTitle: "Создать аккаунт",
    registerDesc: "Начните эффективно управлять своим временем",
  }
}

export type Language = "uz" | "ru";

export function getTranslation(lang: string | null | undefined) {
  const l = (lang === "ru" ? "ru" : "uz") as Language;
  return translations[l];
}
