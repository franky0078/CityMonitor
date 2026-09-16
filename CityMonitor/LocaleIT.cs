using System.Collections.Generic;
using Colossal;

namespace CityMonitor
{
    public class LocaleIT : IDictionarySource
    {
        private readonly Setting m_Setting;

        public LocaleIT(Setting setting)
        {
            m_Setting = setting;
        }

        public IEnumerable<KeyValuePair<string, string>> ReadEntries(
            IList<IDictionaryEntryError> errors,
            Dictionary<string, int> indexCounts)
        {
            return new Dictionary<string, string>
            {
                { m_Setting.GetSettingsLocaleID(), "City Monitor" },
                { m_Setting.GetOptionTabLocaleID(Setting.kSection), "Generale" },
                { m_Setting.GetOptionTabLocaleID(Setting.kThresholdSection), "Soglie dei colori" },

                { m_Setting.GetOptionGroupLocaleID(Setting.kGeneralGroup), "Generale" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kDisplayGroup), "Visualizzazione" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kUpdateGroup), "Aggiornamento" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kPopulationThresholdGroup), "Popolazione e posti di lavoro" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kCapacityThresholdGroup), "Capacità e flusso del traffico" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kRiskThresholdGroup), "Rischi" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kAboutGroup), "Informazioni sulla mod" },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ShowPanel)), "Mostra pannello" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ShowPanel)),
                    "Mostra o nasconde City Monitor, incluso il relativo pulsante nel gioco." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ButtonLocation)), "Posizione del pulsante della mod" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ButtonLocation)),
                    "Imposta se il pulsante di City Monitor viene mostrato nella posizione originale o nel nuovo menu universale delle mod." },
                { m_Setting.GetEnumValueLocaleID(ModButtonLocation.Standard), "Standard (posizione originale)" },
                { m_Setting.GetEnumValueLocaleID(ModButtonLocation.UniversalModMenu), "Menu universale delle mod" },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.CompactValues)), "Mostra solo i valori rilevanti" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.CompactValues)),
                    "Riduce gli indicatori con più valori ai dati più importanti. Si applica a disoccupazione, senzatetto, posti di lavoro, scuole e servizi combinati come acqua e fognature. Nella modalità icone compatte si applica anche ai suggerimenti visualizzati al passaggio del mouse." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ShowLabels)), "Mostra etichette" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ShowLabels)),
                    "Mostra i nomi degli indicatori e dei servizi cittadini accanto alle relative icone." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconOnlyMode)), "Modalità icone compatte" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconOnlyMode)),
                    "Mostra solo le icone di stato, senza sfondo o intestazione del pannello. Un anello colorato indica lo stato e i valori vengono mostrati al passaggio del mouse." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconOrientation)), "Orientamento della barra delle icone" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconOrientation)),
                    "Imposta se la barra delle icone viene visualizzata in verticale o in orizzontale." },
                { m_Setting.GetEnumValueLocaleID(IconBarOrientation.Vertical), "Verticale" },
                { m_Setting.GetEnumValueLocaleID(IconBarOrientation.Horizontal), "Orizzontale" },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconPositionLocked)), "Blocca barra delle icone" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconPositionLocked)),
                    "Blocca la barra delle icone nella posizione attuale. Se l'opzione è disattivata, la barra può essere spostata con il mouse." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconVisibilityEditMode)), "Modifica icone" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconVisibilityEditMode)),
                    "Attiva la modifica della barra delle icone. Trascina le icone con il pulsante sinistro per cambiarne l'ordine e fai clic con il pulsante destro per nasconderle o mostrarle. Le icone visibili sono completamente opache, mentre quelle nascoste hanno una trasparenza del 55%. Quando la modifica è disattivata, le icone nascoste scompaiono e quelle visibili tornano alla trasparenza configurata." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconBackgroundTransparency)), "Trasparenza delle icone (%)" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconBackgroundTransparency)),
                    "Controlla la trasparenza dell'intera icona nella modalità compatta. 0% = completamente visibile, 100% = massima trasparenza. Influisce sull'icona, sull'anello di stato e sullo sfondo circolare scuro; il suggerimento rimane completamente visibile." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconSize)), "Dimensione delle icone" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconSize)),
                    "Imposta la dimensione delle icone di stato rotonde nella modalità compatta. Intervallo: da 22 a 50." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconGap)), "Spaziatura delle icone" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconGap)),
                    "Imposta lo spazio tra le icone di stato nella modalità compatta. Intervallo: da 0 a 20." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ShowAllIcons)), "Mostra tutte le icone" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ShowAllIcons)),
                    "Ripristina tutte le icone nascoste con un clic destro nella modalità compatta." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ResetIconOrder)), "Ripristina ordine delle icone" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ResetIconOrder)),
                    "Ripristina l'ordine predefinito delle icone nella modalità compatta." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.UpdateIntervalSeconds)), "Intervallo di aggiornamento" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.UpdateIntervalSeconds)),
                    "Imposta la frequenza con cui vengono ricalcolati disoccupazione, posti di lavoro e posti scolastici. Intervallo: da 0,5 a 60 secondi. I servizi utilizzano direttamente i dati del gioco. Le icone nascoste non vengono ricalcolate né monitorate." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.UnemploymentGreenMax)), "Disoccupazione: verde fino a" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.UnemploymentGreenMax)), "Lo stato è verde fino a questo tasso di disoccupazione." },
                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.UnemploymentYellowMax)), "Disoccupazione: giallo fino a" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.UnemploymentYellowMax)), "Lo stato è giallo fino a questo tasso di disoccupazione e rosso oltre tale valore." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.HomelessGreenMax)), "Senzatetto: verde fino a" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.HomelessGreenMax)), "Lo stato è verde fino a questa percentuale di senzatetto." },
                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.HomelessYellowMax)), "Senzatetto: giallo fino a" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.HomelessYellowMax)), "Lo stato è giallo fino a questa percentuale e rosso oltre tale valore." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.OpenJobsYellowMin)), "Posti vacanti: giallo da" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.OpenJobsYellowMin)), "Lo stato passa da rosso a giallo a partire da questa percentuale di posti vacanti." },
                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.OpenJobsGreenMin)), "Posti vacanti: verde da" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.OpenJobsGreenMin)), "Lo stato è verde a partire da questa percentuale di posti vacanti." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.SchoolYellowMin)), "Capacità scolastica: giallo da" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.SchoolYellowMin)), "Lo stato passa da rosso a giallo a partire da questa percentuale di posti scolastici liberi." },
                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.SchoolGreenMin)), "Capacità scolastica: verde da" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.SchoolGreenMin)), "Lo stato è verde a partire da questa percentuale di posti scolastici liberi." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.AvailabilityYellowMin)), "Disponibilità: giallo da" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.AvailabilityYellowMin)), "Si applica a sanità, cimitero, crematorio, rifiuti, discarica, elettricità, acqua, parcheggi, posta e attrattività della città." },
                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.AvailabilityGreenMin)), "Disponibilità: verde da" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.AvailabilityGreenMin)), "Lo stato è verde a partire da questo valore di disponibilità." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.TrafficYellowMin)), "Flusso del traffico: giallo da" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.TrafficYellowMin)), "Lo stato passa da rosso a giallo a partire da questo valore del flusso del traffico." },
                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.TrafficGreenMin)), "Flusso del traffico: verde da" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.TrafficGreenMin)), "Lo stato è verde a partire da questo valore del flusso del traffico." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.FireHazardGreenMax)), "Rischio di incendio: verde fino a" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.FireHazardGreenMax)), "Lo stato è verde fino a questo valore del rischio di incendio." },
                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.FireHazardYellowMax)), "Rischio di incendio: giallo fino a" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.FireHazardYellowMax)), "Lo stato è giallo fino a questo valore e rosso oltre tale valore." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.CrimeRiskGreenMax)), "Rischio criminalità: verde fino a" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.CrimeRiskGreenMax)), "Lo stato è verde fino a questo valore del rischio di criminalità." },
                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.CrimeRiskYellowMax)), "Rischio criminalità: giallo fino a" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.CrimeRiskYellowMax)), "Lo stato è giallo fino a questo valore e rosso oltre tale valore." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ResetColorThresholds)), "Ripristina soglie dei colori" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ResetColorThresholds)), "Ripristina tutte le soglie dei colori ai valori predefiniti consigliati." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ModVersion)), "Versione" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ModVersion)), "Versione di City Monitor attualmente installata." },

                // Interfaccia nel gioco
                { "CityMonitor.Toggle", "Mostra o nascondi City Monitor" },
                { "CityMonitor.Drag", "Trascina per spostare la barra delle icone" },
                { "CityMonitor.PositionLocked", "Posizione bloccata" },
                { "CityMonitor.CollapseExpand", "Comprimi / espandi" },
                { "CityMonitor.Resize", "Trascina per ridimensionare" },
                { "CityMonitor.Unemployment", "Disoccupazione" },
                { "CityMonitor.UnemploymentRate", "Tasso" },
                { "CityMonitor.Unemployed", "Disoccupati" },
                { "CityMonitor.Homeless", "Senzatetto" },
                { "CityMonitor.HomelessRate", "Tasso" },
                { "CityMonitor.HomelessPeople", "Persone senzatetto" },
                { "CityMonitor.Jobs", "Posti di lavoro" },
                { "CityMonitor.OpenJobs", "Posti vacanti" },
                { "CityMonitor.Open", "Vacanti" },
                { "CityMonitor.Free", "Liberi" },
                { "CityMonitor.Occupied", "Occupati" },
                { "CityMonitor.Total", "Totale" },
                { "CityMonitor.ElementarySchool", "Scuola elementare" },
                { "CityMonitor.HighSchool", "Scuola superiore" },
                { "CityMonitor.College", "College" },
                { "CityMonitor.University", "Università" },
                { "CityMonitor.HideIcon", "Clic destro: nascondi icona" },
                { "CityMonitor.ShowIcon", "Clic destro: mostra icona" },
                { "CityMonitor.ReorderIcon", "Trascina: cambia ordine" },
                { "CityMonitor.Hidden", "Nascosto" },
                { "CityMonitor.Fire", "Vigili del fuoco e soccorso" },
                { "CityMonitor.FireHazard", "Rischio di incendio" },
                { "CityMonitor.Healthcare", "Sanità" },
                { "CityMonitor.Cemetery", "Cimitero" },
                { "CityMonitor.Crematorium", "Crematorio" },
                { "CityMonitor.Garbage", "Rifiuti" },
                { "CityMonitor.GarbageProcessing", "Trattamento dei rifiuti" },
                { "CityMonitor.GarbageProduction", "Rifiuti" },
                { "CityMonitor.Processing", "Trattamento" },
                { "CityMonitor.ProcessingRate", "Trattamento" },
                { "CityMonitor.Status", "Stato" },
                { "CityMonitor.Landfill", "Discarica" },
                { "CityMonitor.Police", "Polizia" },
                { "CityMonitor.CrimeProbability", "Probabilità di criminalità" },
                { "CityMonitor.JailAvailability", "Disponibilità delle carceri" },
                { "CityMonitor.CrimePerMonth", "Crimini / mese" },
                { "CityMonitor.TrafficFlow", "Flusso del traffico" },
                { "CityMonitor.Electricity", "Elettricità" },
                { "CityMonitor.WaterSewage", "Acqua / fognature" },
                { "CityMonitor.Water", "Acqua" },
                { "CityMonitor.Sewage", "Fognature" },
                { "CityMonitor.Availability", "Disponibilità" },
                { "CityMonitor.CarParking", "Parcheggi auto" },
                { "CityMonitor.BikeParking", "Parcheggi biciclette" },
                { "CityMonitor.Post", "Servizio postale" },
                { "CityMonitor.Tourism", "Turismo" },
                { "CityMonitor.Tourists", "Turisti" },
                { "CityMonitor.Attractiveness", "Attrattività della città" },
            };
        }

        public void Unload() { }
    }
}
