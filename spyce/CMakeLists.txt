cmake_minimum_required(VERSION 3.0.0)

set(CMAKE_VERBOSE_MAKEFILE on)

project(Spyce)

#
# Set up Variables
#
set(PYTHON_MAJOR_VERSION "3")
set(PYTHON_VERSION "3.6m")

if(CMAKE_SIZEOF_VOID_P EQUAL 8)
    set(ARCH "64")
else()
    set(ARCH "32")
endif()

if(APPLE)
    set(PLATFORM "apple")
elseif(UNIX)
    set(PLATFORM "linux")
elseif(WIN32)
    set(PLATFORM "win32")
endif()

#
# Actual Project Declarations
#
set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall")

include_directories(
        cspice/include
        inc
        /usr/include/python${PYTHON_VERSION})

link_directories(
    cspice/lib)

add_library( spyce SHARED
    py_wrapper.cpp
    spyce_main.cpp)
set_target_properties( spyce PROPERTIES
    LIBRARY_OUTPUT_DIRECTORY "../../spyce")

target_link_libraries( spyce
        cspice_${PLATFORM}_${ARCH}.a
        python${PYTHON_VERSION})

find_package(Boost REQUIRED)
IF (Boost_FOUND)
    include_directories(${Boost_INCLUDE_DIR})
    set(Boost_USE_STATIC_LIBS OFF)
    target_link_libraries( spyce
        boost_python${PYTHON_MAJOR_VERSION}
        boost_filesystem
        boost_system)
endif()