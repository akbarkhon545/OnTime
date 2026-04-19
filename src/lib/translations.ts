export const translations = {
  uz: {
    dashboard: "Dashboard",
    tasks: "Vazifalar",
    calendar: "Kalendar",
    categories: "Kategoriyalar",
    settings: "Sozlamalar",
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
    signOut: "Chiqish",
    addTask: "Vazifa qo'shish",
    pending: "Kutilmoqda",
    completed: "Bajarildi",
    in_progress: "Jarayonda",
    cancelled: "Bekor qilindi",
  },
  ru: {
    dashboard: "Дашборд",
    tasks: "Задачи",
    calendar: "Календарь",
    categories: "Категории",
    settings: "Настройки",
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
    signOut: "Выйти",
    addTask: "Добавить задачу",
    pending: "Ожидание",
    completed: "Завершено",
    in_progress: "В процессе",
    cancelled: "Отменено",
  }
}

export type Language = "uz" | "ru";

export function getTranslation(lang: string | null | undefined) {
  const l = (lang === "ru" ? "ru" : "uz") as Language;
  return translations[l];
}
