package com.dashboard.jobs;

import java.util.List;

public class CompanyAtsConfig {

    public enum AtsType { GREENHOUSE, ASHBY }

    public record CompanyConfig(
        String companyName,
        AtsType atsType,
        String boardToken,
        boolean euHost,
        String requiredKeyword  // optional extra filter, null = no extra filter
    ) {
        public CompanyConfig(String companyName, AtsType atsType, String boardToken) {
            this(companyName, atsType, boardToken, false, null);
        }
        public CompanyConfig(String companyName, AtsType atsType, String boardToken, boolean euHost) {
            this(companyName, atsType, boardToken, euHost, null);
        }
    }

    public static final List<CompanyConfig> COMPANIES = List.of(
        new CompanyConfig("Ellipsis Labs", AtsType.ASHBY, "ellipsislabs"),
        new CompanyConfig("Anduril", AtsType.GREENHOUSE, "andurilindustries", false, "intern"),
        new CompanyConfig("IMC Trading", AtsType.GREENHOUSE, "imc", true),
        new CompanyConfig("Walleye Capital (Internships)", AtsType.GREENHOUSE, "walleyecapital-external-students"),
        new CompanyConfig("Walleye Capital (Full Time)", AtsType.GREENHOUSE, "walleyecapital-external-fulltime")
    );
}