<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\EntryPoint\AuthenticationEntryPointInterface;

class JsonLoginEntryPoint implements AuthenticationEntryPointInterface
{
    public function start(Request $request, AuthenticationException $authException = null): Response
    {
        return new JsonResponse(
            ['error' => 'Authentication required', 'message' => 'Full authentication is required to access this resource.'],
            Response::HTTP_UNAUTHORIZED
        );
    }
}
