/*
 * // This file is part of React-Invenio-Forms
 * // Copyright (C) 2024 CERN.
 * //
 * // React-Invenio-Forms is free software; you can redistribute it and/or modify it
 * // under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import { Image } from "../../../Image";
import { Header } from "semantic-ui-react";
import { Trans } from "react-i18next";

const makeIdEntry = (identifier) => {
  let icon, link;

  switch (identifier.scheme) {
    case "orcid":
      icon = "/static/images/orcid.svg";
      link = `https://orcid.org/${identifier.identifier}`;
      break;
    case "gnd":
      icon = "/static/images/gnd-icon.svg";
      link = `https://d-nb.info/gnd/${identifier.identifier}`;
      break;
    case "ror": // ROR doesn't recommend displaying ROR IDs
    case "isni":
    case "grid":
      return; // Skip these schemes
    default:
      return (
        <>
          {identifier.scheme}: {identifier.identifier}
        </>
      );
  }

  return (
    <span key={identifier.identifier}>
      <a href={link} target="_blank" rel="noopener noreferrer">
        <Image src={icon} className="inline-id-icon mr-5" verticalAlign="middle" />
        {identifier.scheme === "orcid" && identifier.identifier}
      </a>
    </span>
  );
};

const makeSubheader = (creatibutor, isOrganization) => {
  if (isOrganization) {
    const locationPart = [creatibutor?.location_name, creatibutor?.country_name]
      ?.filter(Boolean)
      ?.join(", ");

    const typesPart = creatibutor?.types
      ?.map((type) => type.charAt(0).toUpperCase() + type.slice(1))
      ?.join(", ");

    return `${locationPart}${
      locationPart && typesPart ? " — " : ""
    }${typesPart}`.trim();
  } else {
    return (
      creatibutor?.affiliations?.map((affiliation) => affiliation.name)?.join(", ") ||
      ""
    );
  }
};

export const AffiliationsSuggestions = (
  creatibutors,
  isOrganization,
  showManualEntry
) => {
  const results = creatibutors.map((creatibutor) => {
    // ensure `affiliations` and `identifiers` are present
    creatibutor.affiliations = creatibutor.affiliations || [];
    creatibutor.identifiers = creatibutor.identifiers || [];

    const subheader = makeSubheader(creatibutor, isOrganization);
    let name = creatibutor.name;
    if (creatibutor.acronym) name += ` (${creatibutor.acronym})`;

    const idString = [];
    creatibutor.identifiers?.forEach((i) => {
      const idEntry = makeIdEntry(i);
      if (idEntry) idString.push(idEntry);
    });

    return {
      text: creatibutor.name,
      value: creatibutor.name,
      extra: creatibutor,
      key: creatibutor.name,
      id: creatibutor.id,
      content: (
        <Header>
          {name} {idString.length > 0 && <>({idString})</>}
          <Header.Subheader>{subheader}</Header.Subheader>
        </Header>
      ),
    };
  });

  if (showManualEntry) {
    results.push({
      text: "Manual entry",
      value: "Manual entry",
      extra: "Manual entry",
      key: "manual-entry",
      content: (
        <Header textAlign="center">
          <Header.Content>
            <p>
              <Trans>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
                Couldn't find your person? You can <a>create a new entry</a>.
              </Trans>
            </p>
          </Header.Content>
        </Header>
      ),
    });
  }
  return results;
};
