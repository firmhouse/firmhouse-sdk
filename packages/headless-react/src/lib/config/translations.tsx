import type { ResourceLanguage } from 'i18next';
export type SupportedLanguages =
  | 'de'
  | 'en'
  | 'es'
  | 'fi'
  | 'fr'
  | 'it'
  | 'nl'
  | 'pl'
  | 'ro'
  | 'sv';

export const defaultTranslations: {
  [key in SupportedLanguages]: ResourceLanguage;
} = {
  en: {
    translation: {
      checkout: {
        orderedProduct: {
          billingShippingFrequency: {
            weeks_one: 'Bills & ships every week',
            weeks_other: 'Bill & ships every {{count}} weeks',
            months_one: 'Bill & ships every month',
            months_other: 'Bill & ships every {{count}} months',
            days_one: 'Bill & ships every day',
            days_other: 'Bill & ships every {{count}} days',
          },
        },
        interval: {
          weeks_one: 'week',
          weeks_other: '{{count}} weeks',
          months_one: 'month',
          months_other: '{{count}} months',
          days_one: 'day',
          days_other: '{{count}} days',
        },
        form: {
          headers: {
            generalInformation: 'General Information',
            shippingDetails: 'Shipping Details',
            billingDetails: 'Billing Details',
          },
        },
        fields: {
          submit: 'Proceed to payment',
          differentBillingAddress: {
            label: 'Different billing address',
          },
          companyName: {
            label: 'Company name',
            placeholder: 'Company name',
          },
          vatNumber: {
            label: 'VAT number',
            placeholder: 'VAT number',
          },
          salutation: {
            label: 'Salutation',
            placeholder: 'Salutation',
            options: {
              mr: 'Mr',
              ms: 'Ms',
              mx: 'Mx',
            },
          },
          // label, placeholder, options translations name, lastName, dateOfBirth, address,  zipcode,houseNumber, city, country, state, district, phoneNumber, billToCompanyName, billToSalutation, billToName, billToLastName, billToAddress, billToZipcode, billToCity, billToCountry, billToState, billToDistrict, billToPhoneNumber, email
          name: {
            label: 'First name',
            placeholder: 'First name',
          },
          lastName: {
            label: 'Last name',
            placeholder: 'Last name',
          },
          dateOfBirth: {
            label: 'Birthday',
          },
          address: {
            label: 'Street',
            placeholder: 'Street',
          },
          zipcode: {
            label: 'Postal code / ZIP code',
            placeholder: 'Postal code / ZIP code',
          },
          houseNumber: {
            label: 'House number',
            placeholder: 'House number',
          },
          city: {
            label: 'City',
            placeholder: 'City',
          },

          country: {
            label: 'Country',
            placeholder: 'Country',
          },
          state: {
            label: 'State',
            placeholder: 'State',
          },
          district: {
            label: 'District',
            placeholder: 'District',
          },
          phoneNumber: {
            label: 'Phone number',
            placeholder: '+31 123 456 789',
          },
          billToCompanyName: {
            label: 'Company name',
            placeholder: 'Company name',
          },
          billToSalutation: {
            label: 'Salutation',
            placeholder: 'Salutation',
            options: {
              mr: 'Mr',
              ms: 'Ms',
              mx: 'Mx',
            },
          },
          billToName: {
            label: 'First name',
            placeholder: 'First name',
          },
          billToLastName: {
            label: 'Last name',
            placeholder: 'Last name',
          },
          billToAddress: {
            label: 'Street',
            placeholder: 'Street',
          },
          billToZipcode: {
            label: 'Postal code / ZIP code',
            placeholder: 'Postal code / ZIP code',
          },
          billToHouseNumber: {
            label: 'House number',
            placeholder: 'House number',
          },
          billToCity: {
            label: 'City',
            placeholder: 'City',
          },
          billToCountry: {
            label: 'Country',
            placeholder: 'Country',
          },
          billToState: {
            label: 'State',
            placeholder: 'State',
          },
          billToDistrict: {
            label: 'District',
            placeholder: 'District',
          },
          billToPhoneNumber: {
            label: 'Phone number',
            placeholder: 'Phone number',
          },
          email: {
            label: 'Email',
            placeholder: 'Email',
          },
        },
        orderSummary: {
          total: 'Total',
          tax: 'Including {{amount}} Tax',
        },
      },
    },
  },
  de: {
    translation: {
      checkout: {
        orderedProduct: {
          billingShippingFrequency: {
            weeks_one: 'Wird wöchentlich abgerechnet und versendet',
            weeks_other: 'Wird alle {{count}} Wochen abgerechnet und versendet',
            months_one: 'Wird monatlich abgerechnet und versendet',
            months_other:
              'Wird alle {{count}} Monate abgerechnet und versendet',
            days_one: 'Wird täglich abgerechnet und versendet',
            days_other: 'Wird alle {{count}} Tage abgerechnet und versendet',
          },
        },
        interval: {
          weeks_one: 'Woche',
          weeks_other: '{{count}} Wochen',
          months_one: 'Monat',
          months_other: '{{count}} Monate',
          days_one: 'Tag',
          days_other: '{{count}} Tage',
        },
        form: {
          headers: {
            generalInformation: 'Allgemeine Informationen',
            shippingDetails: 'Lieferanschrift',
            billingDetails: 'Rechnungsadresse',
          },
        },
        fields: {
          submit: 'Weiter zur Zahlung',
          differentBillingAddress: {
            label: 'Abweichende Rechnungsadresse',
          },
          companyName: {
            label: 'Name der Firma',
            placeholder: 'Name der Firma',
          },
          vatNumber: {
            label: 'Umsatzsteueridentifikationsnummer',
            placeholder: 'Umsatzsteueridentifikationsnummer',
          },
          salutation: {
            label: 'Anrede',
            placeholder: 'Anrede',
            options: {
              mr: 'Herr',
              ms: 'Frau',
              mx: 'Mx',
            },
          },
          name: {
            label: 'Vorname',
            placeholder: 'Vorname',
          },
          lastName: {
            label: 'Nachname',
            placeholder: 'Nachname',
          },
          dateOfBirth: {
            label: 'Geburtsdatum',
          },
          address: {
            label: 'Straße',
            placeholder: 'Straße',
          },
          houseNumber: {
            label: 'Hausnummer',
            placeholder: 'Hausnummer',
          },
          zipcode: {
            label: 'Postleitzahl',
            placeholder: 'Postleitzahl',
          },
          city: {
            label: 'Stadt',
            placeholder: 'Stadt',
          },
          country: {
            label: 'Land',
            placeholder: 'Land',
          },
          state: {
            label: 'State',
            placeholder: 'State',
          },
          district: {
            label: 'Bezirk',
            placeholder: 'Bezirk',
          },
          phoneNumber: {
            label: 'Telefonnummer',
            placeholder: '+31 123 456 789',
          },
          billToCompanyName: {
            label: 'Firmenname',
            placeholder: 'Firmenname',
          },
          billToSalutation: {
            label: 'Anrede',
            placeholder: 'Anrede',
            options: {
              mr: 'Mr',
              ms: 'Ms',
              mx: 'Mx',
            },
          },
          billToName: {
            label: 'Vorname',
            placeholder: 'Vorname',
          },
          billToLastName: {
            label: 'Nachname',
            placeholder: 'Nachname',
          },
          billToAddress: {
            label: 'Straße',
            placeholder: 'Straße',
          },
          billToHouseNumber: {
            label: 'Hausnummer',
            placeholder: 'Hausnummer',
          },
          billToZipcode: {
            label: 'Postleitzahl',
            placeholder: 'Postleitzahl',
          },
          billToCity: {
            label: 'Stadt',
            placeholder: 'Stadt',
          },
          billToCountry: {
            label: 'Land',
            placeholder: 'Land',
          },
          billToState: {
            label: 'State',
            placeholder: 'State',
          },
          billToDistrict: {
            label: 'Bezirk',
            placeholder: 'Bezirk',
          },
          billToPhoneNumber: {
            label: 'Telefonnummer',
            placeholder: 'Telefonnummer',
          },
          email: {
            label: 'Email',
            placeholder: 'Email',
          },
        },
        orderSummary: {
          total: 'Gesamt',
          tax: 'Inklusive {{amount}} Steuern',
        },
      },
    },
  },
  es: {
    translation: {
      checkout: {
        orderedProduct: {
          billingShippingFrequency: {
            weeks_one: 'Factura y envía cada semana',
            weeks_other: 'Factura y envía cada {{count}} semanas',
            months_one: 'Factura y envía cada mes',
            months_other: 'Factura y envía cada {{count}} meses',
            days_one: 'Factura y envía cada día',
            days_other: 'Factura y envía cada {{count}} días',
          },
        },
        interval: {
          weeks_one: 'semana',
          weeks_other: '{{count}} semanas',
          months_one: 'mes',
          months_other: '{{count}} meses',
          days_one: 'día',
          days_other: '{{count}} días',
        },
        form: {
          headers: {
            generalInformation: 'Información general',
            shippingDetails: 'Dirección de envío',
            billingDetails: 'Dirección de facturación',
          },
        },
        fields: {
          submit: 'Continuar al pago',
          differentBillingAddress: {
            label: 'Dirección de facturación diferente',
          },
          companyName: {
            label: 'Nombre de la empresa',
            placeholder: 'Nombre de la empresa',
          },
          vatNumber: {
            label: 'Número de IVA',
            placeholder: 'Número de IVA',
          },
          salutation: {
            label: 'Saludo',
            placeholder: 'Saludo',
            options: {
              mr: 'Mr',
              ms: 'Ms',
              mx: 'Mx',
            },
          },
          name: {
            label: 'Nombre',
            placeholder: 'Nombre',
          },
          lastName: {
            label: 'Apellido',
            placeholder: 'Apellido',
          },
          dateOfBirth: {
            label: 'Fecha de nacimiento',
          },
          address: {
            label: 'Calle',
            placeholder: 'Calle',
          },
          houseNumber: {
            label: 'Número de casa',
            placeholder: 'Número de casa',
          },
          zipcode: {
            label: 'Código postal',
            placeholder: 'Código postal',
          },
          city: {
            label: 'Ciudad',
            placeholder: 'Ciudad',
          },
          country: {
            label: 'País',
            placeholder: 'País',
          },
          state: {
            label: 'Estado',
            placeholder: 'Estado',
          },
          district: {
            label: 'Distrito',
            placeholder: 'Distrito',
          },
          phoneNumber: {
            label: 'Número de teléfono',
            placeholder: '+31 123 456 789',
          },
          billToCompanyName: {
            label: 'Nombre de la empresa',
            placeholder: 'Nombre de la empresa',
          },
          billToSalutation: {
            label: 'Saludo',
            placeholder: 'Saludo',
            options: {
              mr: 'Mr',
              ms: 'Ms',
              mx: 'Mx',
            },
          },
          billToName: {
            label: 'Nombre',
            placeholder: 'Nombre',
          },
          billToLastName: {
            label: 'Apellido',
            placeholder: 'Apellido',
          },
          billToAddress: {
            label: 'Calle',
            placeholder: 'Calle',
          },
          billToHouseNumber: {
            label: 'Número de casa',
            placeholder: 'Número de casa',
          },
          billToZipcode: {
            label: 'Código postal',
            placeholder: 'Código postal',
          },
          billToCity: {
            label: 'Ciudad',
            placeholder: 'Ciudad',
          },
          billToCountry: {
            label: 'País',
            placeholder: 'País',
          },
          billToState: {
            label: 'Estado',
            placeholder: 'Estado',
          },
          billToDistrict: {
            label: 'Distrito',
            placeholder: 'Distrito',
          },
          billToPhoneNumber: {
            label: 'Número de teléfono',
            placeholder: 'Número de teléfono',
          },
          email: {
            label: 'Email',
            placeholder: 'Email',
          },
        },
        orderSummary: {
          total: 'Total',
          tax: 'Incluye {{amount}} impuestos',
        },
      },
    },
  },
  fi: {
    translation: {
      checkout: {
        orderedProduct: {
          billingShippingFrequency: {
            weeks_one: 'Laskutetaan ja lähetetään joka viikko',
            weeks_other: 'Laskutetaan ja lähetetään joka {{count}} viikko',
            months_one: 'Laskutetaan ja lähetetään joka kuukausi',
            months_other: 'Laskutetaan ja lähetetään joka {{count}} kuukausi',
            days_one: 'Laskutetaan ja lähetetään joka päivä',
            days_other: 'Laskutetaan ja lähetetään joka {{count}} päivä',
          },
        },
        interval: {
          weeks_one: 'viikko',
          weeks_other: '{{count}} viikkoa',
          months_one: 'kuukausi',
          months_other: '{{count}} kuukautta',
          days_one: 'päivä',
          days_other: '{{count}} päivää',
        },
        form: {
          headers: {
            generalInformation: 'Yleistiedot',
            shippingDetails: 'Toimitusosoite',
            billingDetails: 'Laskutusosoite',
          },
        },
        fields: {
          submit: 'Siirry maksamaan',
          differentBillingAddress: {
            label: 'Eri laskutusosoite',
          },
          companyName: {
            label: 'Yrityksen nimi',
            placeholder: 'Yrityksen nimi',
          },
          vatNumber: {
            label: 'ALV-numero',
            placeholder: 'ALV-numero',
          },
          salutation: {
            label: 'Tervehdys',
            placeholder: 'Tervehdys',
            options: {
              mr: 'Mr',
              ms: 'Ms',
              mx: 'Mx',
            },
          },
          name: {
            label: 'Etunimi',
            placeholder: 'Etunimi',
          },
          lastName: {
            label: 'Sukunimi',
            placeholder: 'Sukunimi',
          },
          dateOfBirth: {
            label: 'Syntymäpäivä',
          },
          address: {
            label: 'Katuosoite',
            placeholder: 'Katuosoite',
          },
          houseNumber: {
            label: 'Talon numero',
            placeholder: 'Talon numero',
          },
          zipcode: {
            label: 'Postinumero',
            placeholder: 'Postinumero',
          },
          city: {
            label: 'Kaupunki',
            placeholder: 'Kaupunki',
          },
          country: {
            label: 'Maa',
            placeholder: 'Maa',
          },
          state: {
            label: 'Osavaltio',
            placeholder: 'Osavaltio',
          },
          district: {
            label: 'Alue',
            placeholder: 'Alue',
          },
          phoneNumber: {
            label: 'Puhelinnumero',
            placeholder: '+31 123 456 789',
          },
          billToCompanyName: {
            label: 'Yrityksen nimi',
            placeholder: 'Yrityksen nimi',
          },
          billToSalutation: {
            label: 'Tervehdys',
            placeholder: 'Tervehdys',
            options: {
              mr: 'Mr',
              ms: 'Ms',
              mx: 'Mx',
            },
          },
          billToName: {
            label: 'Etunimi',
            placeholder: 'Etunimi',
          },
          billToLastName: {
            label: 'Sukunimi',
            placeholder: 'Sukunimi',
          },
          billToAddress: {
            label: 'Katuosoite',
            placeholder: 'Katuosoite',
          },
          billToHouseNumber: {
            label: 'Talon numero',
            placeholder: 'Talon numero',
          },
          billToZipcode: {
            label: 'Postinumero',
            placeholder: 'Postinumero',
          },
          billToCity: {
            label: 'Kaupunki',
            placeholder: 'Kaupunki',
          },
          billToCountry: {
            label: 'Maa',
            placeholder: 'Maa',
          },
          billToState: {
            label: 'Osavaltio',
            placeholder: 'Osavaltio',
          },
          billToDistrict: {
            label: 'Alue',
            placeholder: 'Alue',
          },
          billToPhoneNumber: {
            label: 'Puhelinnumero',
            placeholder: 'Puhelinnumero',
          },
          email: {
            label: 'Sähköposti',
            placeholder: 'Sähköposti',
          },
        },
        orderSummary: {
          total: 'Yhteensä',
          tax: 'Sisältää {{amount}} verot',
        },
      },
    },
  },
  fr: {
    translation: {
      checkout: {
        orderedProduct: {
          billingShippingFrequency: {
            weeks_one: 'Facture et expédie chaque semaine',
            weeks_other: 'Facture et expédie chaque {{count}} semaines',
            months_one: 'Facture et expédie chaque mois',
            months_other: 'Facture et expédie chaque {{count}} mois',
            days_one: 'Facture et expédie chaque jour',
            days_other: 'Facture et expédie chaque {{count}} jours',
          },
        },
        interval: {
          weeks_one: 'semaine',
          weeks_other: '{{count}} semaines',
          months_one: 'mois',
          months_other: '{{count}} mois',
          days_one: 'jour',
          days_other: '{{count}} jours',
        },
        form: {
          headers: {
            generalInformation: 'Informations générales',
            shippingDetails: 'Adresse de livraison',
            billingDetails: 'Adresse de facturation',
          },
        },
        fields: {
          submit: 'Passer au paiement',
          differentBillingAddress: {
            label: 'Adresse de facturation différente',
          },
          companyName: {
            label: "Nom de l'entreprise",
            placeholder: "Nom de l'entreprise",
          },
          vatNumber: {
            label: 'Numéro de TVA',
            placeholder: 'Numéro de TVA',
          },
          salutation: {
            label: 'Salutation',
            placeholder: 'Salutation',
            options: {
              mr: 'Mr',
              ms: 'Ms',
              mx: 'Mx',
            },
          },
          name: {
            label: 'Prénom',
            placeholder: 'Prénom',
          },
          lastName: {
            label: 'Nom de famille',
            placeholder: 'Nom de famille',
          },
          dateOfBirth: {
            label: 'Date de naissance',
          },
          address: {
            label: 'Rue',
            placeholder: 'Rue',
          },
          houseNumber: {
            label: 'Numéro de maison',
            placeholder: 'Numéro de maison',
          },
          zipcode: {
            label: 'Code postal',
            placeholder: 'Code postal',
          },
          city: {
            label: 'Ville',
            placeholder: 'Ville',
          },
          country: {
            label: 'Pays',
            placeholder: 'Pays',
          },
          state: {
            label: 'État',
            placeholder: 'État',
          },
          district: {
            label: 'District',
            placeholder: 'District',
          },
          phoneNumber: {
            label: 'Numéro de téléphone',
            placeholder: '+31 123 456 789',
          },
          billToCompanyName: {
            label: "Nom de l'entreprise",
            placeholder: "Nom de l'entreprise",
          },
          billToSalutation: {
            label: 'Salutation',
            placeholder: 'Salutation',
            options: {
              mr: 'Mr',
              ms: 'Ms',
              mx: 'Mx',
            },
          },
          billToName: {
            label: 'Prénom',
            placeholder: 'Prénom',
          },
          billToLastName: {
            label: 'Nom de famille',
            placeholder: 'Nom de famille',
          },
          billToAddress: {
            label: 'Rue',
            placeholder: 'Rue',
          },
          billToHouseNumber: {
            label: 'Numéro de maison',
            placeholder: 'Numéro de maison',
          },
          billToZipcode: {
            label: 'Code postal',
            placeholder: 'Code postal',
          },
          billToCity: {
            label: 'Ville',
            placeholder: 'Ville',
          },
          billToCountry: {
            label: 'Pays',
            placeholder: 'Pays',
          },
          billToState: {
            label: 'État',
            placeholder: 'État',
          },
          billToDistrict: {
            label: 'District',
            placeholder: 'District',
          },
          billToPhoneNumber: {
            label: 'Numéro de téléphone',
            placeholder: 'Numéro de téléphone',
          },
          email: {
            label: 'Email',
            placeholder: 'Email',
          },
        },
        orderSummary: {
          total: 'Total',
          tax: 'Taxes incluses {{amount}}',
        },
      },
    },
  },
  it: {
    translation: {
      checkout: {
        orderedProduct: {
          billingShippingFrequency: {
            weeks_one: 'Fattura e spedisce ogni settimana',
            weeks_other: 'Fattura e spedisce ogni {{count}} settimane',
            months_one: 'Fattura e spedisce ogni mese',
            months_other: 'Fattura e spedisce ogni {{count}} mesi',
            days_one: 'Fattura e spedisce ogni giorno',
            days_other: 'Fattura e spedisce ogni {{count}} giorni',
          },
        },
        interval: {
          weeks_one: 'settimana',
          weeks_other: '{{count}} settimane',
          months_one: 'mese',
          months_other: '{{count}} mesi',
          days_one: 'giorno',
          days_other: '{{count}} giorni',
        },
        form: {
          headers: {
            generalInformation: 'Informazioni generali',
            shippingDetails: 'Indirizzo di spedizione',
            billingDetails: 'Indirizzo di fatturazione',
          },
        },
        fields: {
          submit: 'Procedi al pagamento',
          differentBillingAddress: {
            label: 'Indirizzo di fatturazione diverso',
          },
          companyName: {
            label: 'Nome azienda',
            placeholder: 'Nome azienda',
          },
          vatNumber: {
            label: 'Partita IVA',
            placeholder: 'Partita IVA',
          },
          salutation: {
            label: 'Saluto',
            placeholder: 'Saluto',
            options: {
              mr: 'Mr',
              ms: 'Ms',
              mx: 'Mx',
            },
          },
          name: {
            label: 'Nome',
            placeholder: 'Nome',
          },
          lastName: {
            label: 'Cognome',
            placeholder: 'Cognome',
          },
          dateOfBirth: {
            label: 'Data di nascita',
          },
          address: {
            label: 'Via',
            placeholder: 'Via',
          },
          houseNumber: {
            label: 'Numero civico',
            placeholder: 'Numero civico',
          },
          zipcode: {
            label: 'Codice postale',
            placeholder: 'Codice postale',
          },
          city: {
            label: 'Città',
            placeholder: 'Città',
          },
          country: {
            label: 'Paese',
            placeholder: 'Paese',
          },
          state: {
            label: 'Stato',
            placeholder: 'Stato',
          },
          district: {
            label: 'Distretto',
            placeholder: 'Distretto',
          },
          phoneNumber: {
            label: 'Numero di telefono',
            placeholder: '+31 123 456 789',
          },
          billToCompanyName: {
            label: 'Nome azienda',
            placeholder: 'Nome azienda',
          },
          billToSalutation: {
            label: 'Saluto',
            placeholder: 'Saluto',
            options: {
              mr: 'Mr',
              ms: 'Ms',
              mx: 'Mx',
            },
          },
          billToName: {
            label: 'Nome',
            placeholder: 'Nome',
          },
          billToLastName: {
            label: 'Cognome',
            placeholder: 'Cognome',
          },
          billToAddress: {
            label: 'Via',
            placeholder: 'Via',
          },
          billToHouseNumber: {
            label: 'Numero civico',
            placeholder: 'Numero civico',
          },
          billToZipcode: {
            label: 'Codice postale',
            placeholder: 'Codice postale',
          },
          billToCity: {
            label: 'Città',
            placeholder: 'Città',
          },
          billToCountry: {
            label: 'Paese',
            placeholder: 'Paese',
          },
          billToState: {
            label: 'Stato',
            placeholder: 'Stato',
          },
          billToDistrict: {
            label: 'Distretto',
            placeholder: 'Distretto',
          },
          billToPhoneNumber: {
            label: 'Numero di telefono',
            placeholder: 'Numero di telefono',
          },
          email: {
            label: 'Email',
            placeholder: 'Email',
          },
        },
        orderSummary: {
          total: 'Totale',
          tax: 'Iva inclusa {{amount}}',
        },
      },
    },
  },
  nl: {
    translation: {
      checkout: {
        orderedProduct: {
          billingShippingFrequency: {
            weeks_one: 'Elke week geleverd & gefactureerd',
            weeks_other: 'Elke {{count}} weken geleverd & gefactureerd',
            months_one: 'Elke maand geleverd & gefactureerd',
            months_other: 'Elke {{count}} maanden geleverd & gefactureerd',
            days_one: 'Elke dag geleverd & gefactureerd',
            days_other: 'Elke {{count}} dagen geleverd & gefactureerd',
          },
        },
        interval: {
          weeks_one: 'week',
          weeks_other: '{{count}} weken',
          months_one: 'maand',
          months_other: '{{count}} maanden',
          days_one: 'dag',
          days_other: '{{count}} dagen',
        },
        form: {
          headers: {
            generalInformation: 'Algemene informatie',
            shippingDetails: 'Verzendadres',
            billingDetails: 'Factuuradres',
          },
        },
        fields: {
          submit: 'Ga verder naar betalen',
          differentBillingAddress: {
            label: 'Ander factuuradres',
          },
          companyName: {
            label: 'Bedrijfsnaam',
            placeholder: 'Bedrijfsnaam',
          },
          vatNumber: {
            label: 'BTW-nummer',
            placeholder: 'BTW-nummer',
          },
          salutation: {
            label: 'Aanhef',
            placeholder: 'Aanhef',
            options: {
              mr: 'Mr',
              ms: 'Ms',
              mx: 'Mx',
            },
          },
          name: {
            label: 'Voornaam',
            placeholder: 'Voornaam',
          },
          lastName: {
            label: 'Achternaam',
            placeholder: 'Achternaam',
          },
          dateOfBirth: {
            label: 'Geboortedatum',
          },
          address: {
            label: 'Straat',
            placeholder: 'Straat',
          },
          houseNumber: {
            label: 'Huisnummer',
            placeholder: 'Huisnummer',
          },
          zipcode: {
            label: 'Postcode',
            placeholder: 'Postcode',
          },
          city: {
            label: 'Woonplaats',
            placeholder: 'Woonplaats',
          },
          country: {
            label: 'Land',
            placeholder: 'Land',
          },
          state: {
            label: 'State',
            placeholder: 'State',
          },
          district: {
            label: 'District',
            placeholder: 'District',
          },
          phoneNumber: {
            label: 'Telefoonnummer',
            placeholder: '+31 123 456 789',
          },
          billToCompanyName: {
            label: 'Bedrijfsnaam',
            placeholder: 'Bedrijfsnaam',
          },
          billToSalutation: {
            label: 'Aanhef',
            placeholder: 'Aanhef',
            options: {
              mr: 'Mr',
              ms: 'Ms',
              mx: 'Mx',
            },
          },
          billToName: {
            label: 'Voornaam',
            placeholder: 'Voornaam',
          },
          billToLastName: {
            label: 'Achternaam',
            placeholder: 'Achternaam',
          },
          billToAddress: {
            label: 'Straat',
            placeholder: 'Straat',
          },
          billToHouseNumber: {
            label: 'Huisnummer',
            placeholder: 'Huisnummer',
          },
          billToZipcode: {
            label: 'Postcode',
            placeholder: 'Postcode',
          },
          billToCity: {
            label: 'Stad',
            placeholder: 'Stad',
          },
          billToCountry: {
            label: 'Land',
            placeholder: 'Land',
          },
          billToState: {
            label: 'State',
            placeholder: 'State',
          },
          billToDistrict: {
            label: 'District',
            placeholder: 'District',
          },
          billToPhoneNumber: {
            label: 'Telefoonnummer',
            placeholder: 'Telefoonnummer',
          },
          email: {
            label: 'Email',
            placeholder: 'Email',
          },
        },
        orderSummary: {
          total: 'Totaal',
          tax: 'Inclusief {{amount}} BTW',
        },
      },
    },
  },
  pl: {
    translation: {
      checkout: {
        orderedProduct: {
          billingShippingFrequency: {
            weeks_one: 'Fakturowane i wysyłane co tydzień',
            weeks_other: 'Fakturowane i wysyłane co {{count}} tygodnie',
            months_one: 'Fakturowane i wysyłane co miesiąc',
            months_other: 'Fakturowane i wysyłane co {{count}} miesiące',
            days_one: 'Fakturowane i wysyłane codziennie',
            days_other: 'Fakturowane i wysyłane co {{count}} dni',
          },
        },
        interval: {
          weeks_one: 'tydzień',
          weeks_other: '{{count}} tygodnie',
          months_one: 'miesiąc',
          months_other: '{{count}} miesiące',
          days_one: 'dzień',
          days_other: '{{count}} dni',
        },
        form: {
          headers: {
            generalInformation: 'Informacje ogólne',
            shippingDetails: 'Adres dostawy',
            billingDetails: 'Adres do faktury',
          },
        },
        fields: {
          submit: 'Przejdź do płatności',
          differentBillingAddress: {
            label: 'Inny adres do faktury',
          },
          companyName: {
            label: 'Nazwa firmy',
            placeholder: 'Nazwa firmy',
          },
          vatNumber: {
            label: 'Numer VAT',
            placeholder: 'Numer VAT',
          },
          salutation: {
            label: 'Forma grzecznościowa',
            placeholder: 'Forma grzecznościowa',
            options: {
              mr: 'Mr',
              ms: 'Ms',
              mx: 'Mx',
            },
          },
          name: {
            label: 'Imię',
            placeholder: 'Imię',
          },
          lastName: {
            label: 'Nazwisko',
            placeholder: 'Nazwisko',
          },
          dateOfBirth: {
            label: 'Data urodzenia',
          },
          address: {
            label: 'Ulica',
            placeholder: 'Ulica',
          },
          houseNumber: {
            label: 'Numer domu',
            placeholder: 'Numer domu',
          },
          zipcode: {
            label: 'Kod pocztowy',
            placeholder: 'Kod pocztowy',
          },
          city: {
            label: 'Miasto',
            placeholder: 'Miasto',
          },
          country: {
            label: 'Kraj',
            placeholder: 'Kraj',
          },
          state: {
            label: 'State',
            placeholder: 'State',
          },
          district: {
            label: 'Dzielnica',
            placeholder: 'Dzielnica',
          },
          phoneNumber: {
            label: 'Numer telefonu',
            placeholder: '+31 123 456 789',
          },
          billToCompanyName: {
            label: 'Nazwa firmy',
            placeholder: 'Nazwa firmy',
          },
          billToSalutation: {
            label: 'Forma grzecznościowa',
            placeholder: 'Forma grzecznościowa',
            options: {
              mr: 'Mr',
              ms: 'Ms',
              mx: 'Mx',
            },
          },
          billToName: {
            label: 'Imię',
            placeholder: 'Imię',
          },
          billToLastName: {
            label: 'Nazwisko',
            placeholder: 'Nazwisko',
          },
          billToAddress: {
            label: 'Ulica',
            placeholder: 'Ulica',
          },
          billToHouseNumber: {
            label: 'Numer domu',
            placeholder: 'Numer domu',
          },
          billToZipcode: {
            label: 'Kod pocztowy',
            placeholder: 'Kod pocztowy',
          },
          billToCity: {
            label: 'Miasto',
            placeholder: 'Miasto',
          },
          billToCountry: {
            label: 'Kraj',
            placeholder: 'Kraj',
          },
          billToState: {
            label: 'State',
            placeholder: 'State',
          },
          billToDistrict: {
            label: 'Dzielnica',
            placeholder: 'Dzielnica',
          },
          billToPhoneNumber: {
            label: 'Numer telefonu',
            placeholder: 'Numer telefonu',
          },
          email: {
            label: 'Email',
            placeholder: 'Email',
          },
        },
        orderSummary: {
          total: 'Razem',
          tax: 'W tym {{amount}} podatek',
        },
      },
    },
  },
  ro: {
    translation: {
      checkout: {
        orderedProduct: {
          billingShippingFrequency: {
            weeks_one: 'Facturează și expediază în fiecare săptămână',
            weeks_other:
              'Facturează și expediază în fiecare {{count}} săptămâni',
            months_one: 'Facturează și expediază în fiecare lună',
            months_other: 'Facturează și expediază în fiecare {{count}} luni',
            days_one: 'Facturează și expediază în fiecare zi',
            days_other: 'Facturează și expediază în fiecare {{count}} zile',
          },
        },
        interval: {
          weeks_one: 'săptămână',
          weeks_other: '{{count}} săptămâni',
          months_one: 'lună',
          months_other: '{{count}} luni',
          days_one: 'zi',
          days_other: '{{count}} zile',
        },
        form: {
          headers: {
            generalInformation: 'Informații generale',
            shippingDetails: 'Adresa de livrare',
            billingDetails: 'Adresa de facturare',
          },
        },
        fields: {
          submit: 'Continuă la plată',
          differentBillingAddress: {
            label: 'Adresă de facturare diferită',
          },
          companyName: {
            label: 'Numele companiei',
            placeholder: 'Numele companiei',
          },
          vatNumber: {
            label: 'Codul TVA',
            placeholder: 'Codul TVA',
          },
          salutation: {
            label: 'Salut',
            placeholder: 'Salut',
            options: {
              mr: 'Mr',
              ms: 'Ms',
              mx: 'Mx',
            },
          },
          name: {
            label: 'Prenume',
            placeholder: 'Prenume',
          },
          lastName: {
            label: 'Nume de familie',
            placeholder: 'Nume de familie',
          },
          dateOfBirth: {
            label: 'Data nașterii',
          },
          address: {
            label: 'Strada',
            placeholder: 'Strada',
          },
          houseNumber: {
            label: 'Numărul casei',
            placeholder: 'Numărul casei',
          },
          zipcode: {
            label: 'Cod poștal',
            placeholder: 'Cod poștal',
          },
          city: {
            label: 'Oraș',
            placeholder: 'Oraș',
          },
          country: {
            label: 'Țară',
            placeholder: 'Țară',
          },
          state: {
            label: 'State',
            placeholder: 'State',
          },
          district: {
            label: 'Sector',
            placeholder: 'Sector',
          },
          phoneNumber: {
            label: 'Număr de telefon',
            placeholder: '+31 123 456 789',
          },
          billToCompanyName: {
            label: 'Numele companiei',
            placeholder: 'Numele companiei',
          },
          billToSalutation: {
            label: 'Salut',
            placeholder: 'Salut',
            options: {
              mr: 'Mr',
              ms: 'Ms',
              mx: 'Mx',
            },
          },
          billToName: {
            label: 'Prenume',
            placeholder: 'Prenume',
          },
          billToLastName: {
            label: 'Nume de familie',
            placeholder: 'Nume de familie',
          },
          billToAddress: {
            label: 'Strada',
            placeholder: 'Strada',
          },
          billToHouseNumber: {
            label: 'Numărul casei',
            placeholder: 'Numărul casei',
          },
          billToZipcode: {
            label: 'Cod poștal',
            placeholder: 'Cod poștal',
          },
          billToCity: {
            label: 'Oraș',
            placeholder: 'Oraș',
          },
          billToCountry: {
            label: 'Țară',
            placeholder: 'Țară',
          },
          billToState: {
            label: 'State',
            placeholder: 'State',
          },
          billToDistrict: {
            label: 'Sector',
            placeholder: 'Sector',
          },
          billToPhoneNumber: {
            label: 'Număr de telefon',
            placeholder: 'Număr de telefon',
          },
          email: {
            label: 'Email',
            placeholder: 'Email',
          },
        },
        orderSummary: {
          total: 'Total',
          tax: 'Inclusiv {{amount}} taxe',
        },
      },
    },
  },
  sv: {
    translation: {
      checkout: {
        orderedProduct: {
          billingShippingFrequency: {
            weeks_one: 'Fakturerar och skickar varje vecka',
            weeks_other: 'Fakturerar och skickar varje {{count}} veckor',
            months_one: 'Fakturerar och skickar varje månad',
            months_other: 'Fakturerar och skickar varje {{count}} månader',
            days_one: 'Fakturerar och skickar varje dag',
            days_other: 'Fakturerar och skickar varje {{count}} dagar',
          },
        },
        interval: {
          weeks_one: 'vecka',
          weeks_other: '{{count}} veckor',
          months_one: 'månad',
          months_other: '{{count}} månader',
          days_one: 'dag',
          days_other: '{{count}} dagar',
        },
        form: {
          headers: {
            generalInformation: 'Allmän information',
            shippingDetails: 'Leveransadress',
            billingDetails: 'Faktureringsadress',
          },
        },
        fields: {
          submit: 'Gå vidare till betalning',
          differentBillingAddress: {
            label: 'Annan faktureringsadress',
          },
          companyName: {
            label: 'Företagsnamn',
            placeholder: 'Företagsnamn',
          },
          vatNumber: {
            label: 'Momsnummer',
            placeholder: 'Momsnummer',
          },
          salutation: {
            label: 'Hälsning',
            placeholder: 'Hälsning',
            options: {
              mr: 'Mr',
              ms: 'Ms',
              mx: 'Mx',
            },
          },
          name: {
            label: 'Förnamn',
            placeholder: 'Förnamn',
          },
          lastName: {
            label: 'Efternamn',
            placeholder: 'Efternamn',
          },
          dateOfBirth: {
            label: 'Födelsedatum',
          },
          address: {
            label: 'Gata',
            placeholder: 'Gata',
          },
          houseNumber: {
            label: 'Husnummer',
            placeholder: 'Husnummer',
          },
          zipcode: {
            label: 'Postnummer',
            placeholder: 'Postnummer',
          },
          city: {
            label: 'Stad',
            placeholder: 'Stad',
          },
          country: {
            label: 'Land',
            placeholder: 'Land',
          },
          state: {
            label: 'State',
            placeholder: 'State',
          },
          district: {
            label: 'Distrikt',
            placeholder: 'Distrikt',
          },
          phoneNumber: {
            label: 'Telefonnummer',
            placeholder: '+31 123 456 789',
          },
          billToCompanyName: {
            label: 'Företagsnamn',
            placeholder: 'Företagsnamn',
          },
          billToSalutation: {
            label: 'Hälsning',
            placeholder: 'Hälsning',
            options: {
              mr: 'Mr',
              ms: 'Ms',
              mx: 'Mx',
            },
          },
          billToName: {
            label: 'Förnamn',
            placeholder: 'Förnamn',
          },
          billToLastName: {
            label: 'Efternamn',
            placeholder: 'Efternamn',
          },
          billToAddress: {
            label: 'Gata',
            placeholder: 'Gata',
          },
          billToHouseNumber: {
            label: 'Husnummer',
            placeholder: 'Husnummer',
          },
          billToZipcode: {
            label: 'Postnummer',
            placeholder: 'Postnummer',
          },
          billToCity: {
            label: 'Stad',
            placeholder: 'Stad',
          },
          billToCountry: {
            label: 'Land',
            placeholder: 'Land',
          },
          billToState: {
            label: 'State',
            placeholder: 'State',
          },
          billToDistrict: {
            label: 'Distrikt',
            placeholder: 'Distrikt',
          },
          billToPhoneNumber: {
            label: 'Telefonnummer',
            placeholder: 'Telefonnummer',
          },
          email: {
            label: 'E-post',
            placeholder: 'E-post',
          },
        },
      },
    },
  },
};

export type CheckoutTranslations = typeof defaultTranslations;
