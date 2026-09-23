// ── Data ──────────────────────────────────────────────────────────────────────
      const KEY = "glu-v2";
      const DEFAULTS = {
        stops: [
          {
            id: "a",
            name: "Koningin Wilhelminalaan",
            departures: [
              { line: "2", dest: "Utrecht CS", min: 3 },
              { line: "28", dest: "Lombok", min: 7 },
              { line: "2", dest: "Utrecht CS", min: 13 },
            ],
          },
          {
            id: "b",
            name: "Croeselaan",
            departures: [
              { line: "8", dest: "Nieuwegein", min: 1 },
              { line: "12", dest: "De Uithof", min: 9 },
              { line: "8", dest: "Nieuwegein", min: 16 },
            ],
          },
          {
            id: "c",
            name: "Churchilllaan",
            departures: [
              { line: "4", dest: "Overvecht", min: 4 },
              { line: "11", dest: "Vleuterweide", min: 11 },
              { line: "4", dest: "Overvecht", min: 19 },
            ],
          },
        ],
        schedule: {
          "3WDV1": [
            {
              time: "08:30–10:00",
              subject: "Typografie",
              room: "A204",
              teacher: "Mevr. Smit",
            },
            {
              time: "10:15–11:45",
              subject: "Illustratie",
              room: "B106",
              teacher: "Dhr. De Boer",
            },
            {
              time: "12:30–14:00",
              subject: "Webdesign",
              room: "ICT-3",
              teacher: "Dhr. Verhoef",
            },
            {
              time: "14:15–15:45",
              subject: "Projectwerk",
              room: "Studio",
              teacher: "Mevr. Smit",
            },
          ],
          "3WDV2": [
            {
              time: "08:30–10:00",
              subject: "Webdesign",
              room: "ICT-3",
              teacher: "Dhr. Verhoef",
            },
            {
              time: "10:15–11:45",
              subject: "Typografie",
              room: "A204",
              teacher: "Mevr. Smit",
            },
            {
              time: "12:30–14:00",
              subject: "Illustratie",
              room: "B106",
              teacher: "Dhr. De Boer",
            },
            {
              time: "14:15–15:45",
              subject: "Vrij uur",
              room: "—",
              teacher: "—",
            },
          ],
        },
        announcements: [
          {
            id: "1",
            priority: "urgent",
            author: "Dhr. Verhoef",
            title: "Portfolio deadline morgen",
            body: "Lever je webdesign portfolio in via ELO vóór 23:59 morgen.",
            classes: ["3WDV1", "3WDV2"],
            expires: "morgen 23:59",
          },
          {
            id: "2",
            priority: "info",
            author: "Mevr. Smit",
            title: "Typografie — lokaal gewijzigd A301",
            body: "Wegens verbouwing is de les van donderdag in lokaal A301 i.p.v. A204.",
            classes: ["3WDV1"],
            expires: "do 25 sept",
          },
          {
            id: "3",
            priority: "reminder",
            author: "Mentrix Hoek",
            title: "Ouderavond — aanmelden verplicht",
            body: "Meld je ouders aan via Magister. Di 30 sept, 19:00–21:30.",
            classes: ["3WDV1", "3WDV2"],
            expires: "di 30 sept",
          },
        ],
      };

      function load() {
        try {
          const r = localStorage.getItem(KEY);
          if (r) return JSON.parse(r);
        } catch {}
        return JSON.parse(JSON.stringify(DEFAULTS));
      }
      function save() {
        localStorage.setItem(KEY, JSON.stringify(DB));
        showSaved();
      }
      function uid() {
        return Math.random().toString(36).slice(2, 8);
      }

      let DB = load();
