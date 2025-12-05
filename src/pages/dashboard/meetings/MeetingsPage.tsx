import { Calendar, ChevronDown, Clock, Plus, Search } from 'lucide-react';

// Моковые данные
const MOCK_MEETINGS = [
  {
    id: 1,
    title: 'Лмс система',
    duration: '00:40',
    project: 'лмс система',
    date: 'Сен 11, 2025 12:00',
    dateShort: '01.07.2025',
    timeShort: '01.07.2025',
    projectTag: 'LMS project',
    people: 'Доступы',
  },
  {
    id: 2,
    title: 'Лмс система',
    duration: '00:40',
    project: 'лмс система',
    date: 'Сен 11, 2025 12:00',
    dateShort: '01.07.2025',
    timeShort: '01.07.2025',
    projectTag: 'LMS project',
    people: 'Доступы',
  },
  {
    id: 3,
    title: 'Лмс система',
    duration: '00:40',
    project: 'лмс система',
    date: 'Сен 11, 2025 12:00',
    dateShort: '01.07.2025',
    timeShort: '01.07.2025',
    projectTag: 'LMS project',
    people: 'Доступы',
  },
  {
    id: 4,
    title: 'Лмс система',
    duration: '00:40',
    project: 'лмс система',
    date: 'Сен 11, 2025 12:00',
    dateShort: '01.07.2025',
    timeShort: '01.07.2025',
    projectTag: 'LMS project',
    people: 'Доступы',
  },
  {
    id: 5,
    title: 'Лмс система',
    duration: '00:40',
    project: 'лмс система',
    date: 'Сен 11, 2025 12:00',
    dateShort: '01.07.2025',
    timeShort: '01.07.2025',
    projectTag: 'LMS project',
    people: 'Доступы',
  },
];

const TABS = ['Новые', 'Все', 'Архив'];

const MeetingsPage = () => {
  const activeTab = 'Новые';

  return (
    <div className="mx-auto flex w-full max-w-[1104px] flex-col gap-7 px-4 py-6 lg:px-0">
      {/* Header Section */}
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
        {/* Title */}
        <h1 className="font-semibold text-3xl text-text-quaternary leading-8 lg:text-4xl lg:leading-10">
          Мои встречи
        </h1>

        {/* Search and Add Button - Desktop Only */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Search Input */}
          <div className="flex h-9 w-72 items-center gap-3 rounded-lg bg-fill-secondary px-2 py-2">
            <Search className="h-6 w-6 flex-shrink-0 text-text-secondary" />
            <div className="flex items-center gap-0.5">
              <div className="h-5 w-0.5 rounded-sm bg-primary" />
              <span className="font-semibold text-base text-text-secondary">Search by name or email</span>
            </div>
          </div>

          {/* Add Button */}
          <button
            type="button"
            className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 transition-colors hover:bg-primary-hover"
          >
            <span className="font-semibold text-on-primary text-sm">Добавить</span>
            <Plus className="h-4 w-4 text-on-primary" />
          </button>
        </div>
      </header>

      {/* Tabs Section */}
      <nav className="w-full lg:w-auto">
        <div className="flex h-10 items-center gap-1.5 rounded-xl border border-fill-quaternary bg-fill-secondary p-[5px] lg:inline-flex lg:rounded-xl lg:border-0">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`flex h-7 flex-1 items-center justify-center rounded-lg px-4 transition-colors lg:flex-none lg:px-5 ${
                activeTab === tab
                  ? 'bg-fill-tertiary font-medium text-on-primary'
                  : 'font-medium text-text-tertiary hover:bg-fill-tertiary/50'
              }text-sm leading-5 lg:text-base lg:leading-6`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop Table */}
      <div className="hidden rounded-3xl border border-fill-secondary bg-fill-primary p-4 lg:block">
        {/* Table Header */}
        <div className="border-fill-quaternary border-b px-6 py-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-base text-text-secondary">Название</span>

            <div className="ml-6 flex max-w-[701px] flex-1 items-center justify-between">
              <button
                type="button"
                className="flex items-center gap-1 font-bold text-base text-text-secondary transition-colors hover:text-text-tertiary"
              >
                <span>Время</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              <span className="font-bold text-base text-text-secondary">Проект</span>

              <button
                type="button"
                className="flex items-center gap-1 font-bold text-base text-text-secondary transition-colors hover:text-text-tertiary"
              >
                <span>Дата</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              <span className="font-bold text-base text-text-secondary">Люди</span>
            </div>
          </div>
        </div>

        {/* Table Rows */}
        <div className="mt-1.5 flex flex-col gap-3">
          {MOCK_MEETINGS.map((meeting, index) => (
            <div
              key={meeting.id}
              className={`flex h-14 items-center justify-between rounded-lg px-6 py-4 ${index % 2 === 0 ? 'bg-fill-secondary' : 'bg-transparent'}
              `}
            >
              <span className="font-semibold text-base text-text-quaternary">{meeting.title}</span>

              <div className="ml-6 flex max-w-[701px] flex-1 items-center justify-between">
                <div className="flex items-center rounded bg-fill-tertiary px-1.5 py-0.5">
                  <span className="font-semibold text-base text-text-tertiary">{meeting.duration}</span>
                </div>

                <span className="font-semibold text-base text-text-quaternary">{meeting.project}</span>

                <span className="font-semibold text-base text-text-tertiary">{meeting.date}</span>

                <button
                  type="button"
                  className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
                >
                  <span className="font-semibold text-base text-text-quaternary">{meeting.people}</span>
                  <ChevronDown className="h-5 w-5 text-text-quaternary" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col gap-2.5 lg:hidden">
        {MOCK_MEETINGS.map((meeting) => (
          <article
            key={meeting.id}
            className="flex flex-col gap-2.5 rounded-lg border border-fill-quaternary bg-fill-secondary px-4 py-3.5"
          >
            {/* Meeting Title */}
            <h3 className="font-semibold text-base text-text-quaternary">{meeting.title}</h3>

            {/* Date and Time */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-text-secondary" />
                <span className="font-medium text-text-secondary text-xs leading-4">{meeting.dateShort}</span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-text-secondary" />
                <span className="font-medium text-text-secondary text-xs leading-4">{meeting.timeShort}</span>
              </div>
            </div>

            {/* Project Tag */}
            <div className="inline-flex">
              <div className="flex h-6 items-center rounded-md bg-button-secondary px-3 py-0.5">
                <span className="font-medium text-text-quaternary text-xs leading-4">
                  {meeting.projectTag}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default MeetingsPage;
