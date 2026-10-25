package com.jobtracker;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String APP_JSON = """
            {"company":"Infosys","roleTitle":"Java Developer","status":"APPLIED",
             "appliedDate":"2025-01-10","notes":"Referral","jobLink":""}
            """;

    /** Registers a fresh user and returns their JWT token. */
    private String registerAndGetToken() throws Exception {
        String email = "user-" + UUID.randomUUID() + "@test.com";
        String body = """
                {"name":"Test User","email":"%s","password":"secret123"}
                """.formatted(email);

        String response = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        return objectMapper.readTree(response).get("token").asText();
    }

    @Test
    void getApplications_withoutToken_returns401() throws Exception {
        mockMvc.perform(get("/api/applications"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void register_withDuplicateEmail_returns409() throws Exception {
        String body = """
                {"name":"Dup","email":"dup@test.com","password":"secret123"}
                """;
        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated());
        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isConflict());
    }

    @Test
    void login_withWrongPassword_returns401() throws Exception {
        String reg = """
                {"name":"Login User","email":"login@test.com","password":"secret123"}
                """;
        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(reg))
                .andExpect(status().isCreated());

        String bad = """
                {"email":"login@test.com","password":"wrongpass"}
                """;
        mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(bad))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createApplication_withToken_returns201() throws Exception {
        String token = registerAndGetToken();

        mockMvc.perform(post("/api/applications")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(APP_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.company").value("Infosys"));
    }

    @Test
    void createApplication_withBlankCompany_returns400() throws Exception {
        String token = registerAndGetToken();
        String bad = """
                {"company":"","roleTitle":"Dev","status":"APPLIED","appliedDate":"2025-01-10"}
                """;
        mockMvc.perform(post("/api/applications")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bad))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.company").exists());
    }

    @Test
    void userCannotSeeAnotherUsersApplication_returns404() throws Exception {
        String tokenA = registerAndGetToken();
        String tokenB = registerAndGetToken();

        String created = mockMvc.perform(post("/api/applications")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(APP_JSON))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long id = objectMapper.readTree(created).get("id").asLong();

        mockMvc.perform(get("/api/applications/" + id)
                        .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isNotFound());

        mockMvc.perform(get("/api/applications/" + id)
                        .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk());
    }

    @Test
    void normalUser_cannotUseAdminEndpoints_returns403() throws Exception {
        String token = registerAndGetToken();

        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }
}
