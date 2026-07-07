package com.dashboard.jobs;

import java.util.List;

public class CompanyAtsConfig {

    public enum AtsType { GREENHOUSE, ASHBY }

    public record CompanyConfig(String companyName, AtsType atsType, String boardToken, boolean euHost) {
        public CompanyConfig(String companyName, AtsType atsType, String boardToken) {
            this(companyName, atsType, boardToken, false);
        }
    }

    // Add more companies here as you confirm their ATS + board token
    public static final List<CompanyConfig> COMPANIES = List.of(
        new CompanyConfig("Ellipsis Labs", AtsType.ASHBY, "ellipsislabs"),
        new CompanyConfig("Anduril", AtsType.GREENHOUSE, "andurilindustries"),
        new CompanyConfig("IMC Trading", AtsType.GREENHOUSE, "imc", true),
        new CompanyConfig("Walleye Capital (Internships)", AtsType.GREENHOUSE, "walleyecapital-external-students"),
        new CompanyConfig("Walleye Capital (Full Time)", AtsType.GREENHOUSE, "walleyecapital-external-fulltime")
    );
}